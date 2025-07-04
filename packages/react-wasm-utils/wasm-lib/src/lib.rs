use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_json::{json, Map, Value};
use csv::ReaderBuilder;
use std::cmp::Ordering;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub async fn init() {
    log("🧠 WASM: init() from Rust called!");
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
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
    // Получаем размер массива для выбора стратегии
    let array_length = js_sys::Reflect::get(data_val, &JsValue::from_str("length"))
        .unwrap_or(JsValue::from(0))
        .as_f64()
        .unwrap_or(0.0) as usize;

    log(&format!("🦀 WASM: сортировка {} записей по ключу '{}'", array_length, key));

    // Для массивов больше 100k используем потоковую сортировку
    if array_length > 100_000 {
        return sort_large_array(data_val, key, array_length);
    }

    // Стандартная сортировка для средних массивов
    let mut data: Vec<Map<String, Value>> = serde_wasm_bindgen::from_value(data_val.clone())
        .map_err(|e| JsValue::from_str(&format!("Ошибка десериализации: {}", e)))?;
    
    data.sort_by(|a, b| {
        let val_a = a.get(key);
        let val_b = b.get(key);

        match (val_a, val_b) {
            (Some(Value::Number(n_a)), Some(Value::Number(n_b))) => {
                if let (Some(f_a), Some(f_b)) = (n_a.as_f64(), n_b.as_f64()) {
                    f_a.partial_cmp(&f_b).unwrap_or(Ordering::Equal)
                } else {
                    Ordering::Equal
                }
            },
            (Some(Value::String(s_a)), Some(Value::String(s_b))) => {
                s_a.cmp(s_b)
            },
            (None, Some(_)) => Ordering::Less,
            (Some(_), None) => Ordering::Greater,
            (Some(Value::Null), Some(_)) => Ordering::Less,
            (Some(_), Some(Value::Null)) => Ordering::Greater,
            _ => Ordering::Equal,
        }
    });

    let result: Vec<Value> = data.into_iter().map(Value::Object).collect();
    Ok(serde_wasm_bindgen::to_value(&result)
        .map_err(|e| JsValue::from_str(&format!("Ошибка сериализации: {}", e)))?)
}

// Потоковая сортировка для больших массивов
fn sort_large_array(data_val: &JsValue, key: &str, array_length: usize) -> Result<JsValue, JsValue> {
    log(&format!("🚀 WASM: потоковая сортировка {} записей", array_length));
    
    let mut all_items: Vec<(String, usize)> = Vec::with_capacity(array_length);
    
    // Шаг 1: Извлекаем только ключи сортировки (экономим память)
    for i in 0..array_length {
        let item = js_sys::Reflect::get(data_val, &JsValue::from(i as u32))
            .map_err(|e| JsValue::from_str(&format!("Ошибка доступа к элементу {}: {:?}", i, e)))?;
        
        let sort_key = js_sys::Reflect::get(&item, &JsValue::from_str(key))
            .unwrap_or(JsValue::NULL);
        
        let key_string = if sort_key.is_string() {
            sort_key.as_string().unwrap_or_default()
        } else if sort_key.as_f64().is_some() {
            sort_key.as_f64().unwrap().to_string()
        } else {
            String::new()
        };
        
        all_items.push((key_string, i));
        
        // Логируем прогресс каждые 25k записей
        if i > 0 && i % 25_000 == 0 {
            log(&format!("📊 Извлечено ключей: {}/{}", i, array_length));
        }
    }
    
    // Шаг 2: Сортируем индексы по ключам
    log("🔄 Сортировка индексов...");
    all_items.sort_by(|a, b| {
        // Пытаемся сравнить как числа
        if let (Ok(num_a), Ok(num_b)) = (a.0.parse::<f64>(), b.0.parse::<f64>()) {
            num_a.partial_cmp(&num_b).unwrap_or(Ordering::Equal)
        } else {
            // Иначе как строки
            a.0.cmp(&b.0)
        }
    });
    
    // Шаг 3: Собираем результат по отсортированным индексам
    log("📋 Сборка результата...");
    let result_array = js_sys::Array::new_with_length(array_length as u32);
    
    for (result_idx, (_, original_idx)) in all_items.iter().enumerate() {
        let original_item = js_sys::Reflect::get(data_val, &JsValue::from(*original_idx as u32))
            .map_err(|e| JsValue::from_str(&format!("Ошибка получения элемента {}: {:?}", original_idx, e)))?;
        
        js_sys::Reflect::set(&result_array, &JsValue::from(result_idx as u32), &original_item)
            .map_err(|e| JsValue::from_str(&format!("Ошибка записи элемента {}: {:?}", result_idx, e)))?;
        
        // Логируем прогресс каждые 25k записей
        if result_idx > 0 && result_idx % 25_000 == 0 {
            log(&format!("✅ Собрано записей: {}/{}", result_idx, array_length));
        }
    }
    
    log(&format!("🎉 Потоковая сортировка завершена: {} записей", array_length));
    Ok(result_array.into())
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