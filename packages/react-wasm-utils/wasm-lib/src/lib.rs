use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::{from_value, to_value};
use js_sys::Promise;
use web_sys::console;
use std::cmp::Ordering;

// JSON и CSV импорты
use serde_json::{Value, Map, json};
use csv::ReaderBuilder;

// Utils
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(feature = "console_error_panic_hook")]
pub fn set_panic_hook() {
    console_error_panic_hook::set_once();
}

// Core modules - только data для CSV парсинга
pub mod data;
pub mod error;
pub mod utils;

// Re-exports - только нужные
pub use data::*;
pub use error::*;
pub use utils::*;

// Initialize the WASM module
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    set_panic_hook();
    
    console::log_1(&"React WASM Utils v0.3.0 - Simple CSV & Object Utils".into());
}

// Health check function
#[wasm_bindgen]
pub fn health_check() -> String {
    "OK: React WASM Utils is running - CSV & Object comparison ready".to_string()
}

// Get version info
#[wasm_bindgen]
pub fn get_version() -> String {
    "0.3.0".to_string()
}

// Get available features - только основные
#[wasm_bindgen]
pub fn get_features() -> JsValue {
    let features = vec![
        "csv_parsing", "object_comparison", "array_sorting"
    ];
    to_value(&features).unwrap()
}

#[derive(Serialize, Deserialize)]
pub struct Record {
    pub id: String,
    pub name: String,
    pub role: String,
}

#[wasm_bindgen]
pub fn deep_equal(a: &JsValue, b: &JsValue) -> Result<bool, JsValue> {
    let a_val: Value = serde_wasm_bindgen::from_value(a.clone())
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    let b_val: Value = serde_wasm_bindgen::from_value(b.clone())
        .map_err(|e| JsValue::from_str(&e.to_string()))?;
    Ok(a_val == b_val)
}

#[wasm_bindgen]
pub fn sort_by_key(data_val: &JsValue, key: &str) -> Result<JsValue, JsValue> {
    // Получаем массив напрямую как js_sys::Array
    let data_array = js_sys::Array::from(data_val);
    let array_length = data_array.length() as usize;

    // Создаем массив индексов для сортировки
    let mut indices: Vec<usize> = (0..array_length).collect();
    let key_js = JsValue::from_str(key);

    // Извлекаем все значения для сортировки ОДНИМ ПРОХОДОМ
    let mut sort_values: Vec<SortValue> = Vec::with_capacity(array_length);
    
    for i in 0..array_length {
        let item = data_array.get(i as u32);
        let sort_key_val = js_sys::Reflect::get(&item, &key_js).unwrap_or(JsValue::NULL);
        
        let sort_value = if sort_key_val.is_string() {
            SortValue::String(sort_key_val.as_string().unwrap_or_default())
        } else if let Some(num) = sort_key_val.as_f64() {
            SortValue::Number(num)
        } else {
            SortValue::Null
        };
        
        sort_values.push(sort_value);
    }
    
    // БЫСТРАЯ RUST СОРТИРОВКА индексов
    indices.sort_unstable_by(|&a, &b| sort_values[a].cmp(&sort_values[b]));
    
    // Собираем результат по отсортированным индексам
    let result_array = js_sys::Array::new_with_length(array_length as u32);
    
    for (new_idx, &original_idx) in indices.iter().enumerate() {
        let original_item = data_array.get(original_idx as u32);
        result_array.set(new_idx as u32, original_item);
    }
    
    Ok(result_array.into())
}

// Enum для значений сортировки
#[derive(Debug, Clone)]
enum SortValue {
    String(String),
    Number(f64),
    Null,
}

impl std::cmp::PartialEq for SortValue {
    fn eq(&self, other: &Self) -> bool {
        match (self, other) {
            (SortValue::String(a), SortValue::String(b)) => a == b,
            (SortValue::Number(a), SortValue::Number(b)) => a == b,
            (SortValue::Null, SortValue::Null) => true,
            _ => false,
        }
    }
}

impl std::cmp::Eq for SortValue {}

impl std::cmp::PartialOrd for SortValue {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl std::cmp::Ord for SortValue {
    fn cmp(&self, other: &Self) -> Ordering {
        match (self, other) {
            (SortValue::Number(a), SortValue::Number(b)) => {
                a.partial_cmp(b).unwrap_or(Ordering::Equal)
            },
            (SortValue::String(a), SortValue::String(b)) => a.cmp(b),
            (SortValue::Null, SortValue::Null) => Ordering::Equal,
            (SortValue::Null, _) => Ordering::Less,
            (_, SortValue::Null) => Ordering::Greater,
            (SortValue::Number(_), SortValue::String(_)) => Ordering::Less,
            (SortValue::String(_), SortValue::Number(_)) => Ordering::Greater,
        }
    }
}

#[wasm_bindgen]
pub fn parse_csv(csv_data: &str) -> Result<JsValue, JsValue> {
    let mut records = Vec::new();
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .from_reader(csv_data.as_bytes());

    let headers = rdr.headers()
        .map_err(|e| JsValue::from_str(&e.to_string()))?
        .clone();

    for result in rdr.records() {
        let record = result.map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        let mut map = Map::new();
        for (header, field) in headers.iter().zip(record.iter()) {
            map.insert(header.to_string(), json!(field));
        }
        
        records.push(Value::Object(map));
    }

    Ok(serde_wasm_bindgen::to_value(&records)
        .map_err(|e| JsValue::from_str(&e.to_string()))?)
}