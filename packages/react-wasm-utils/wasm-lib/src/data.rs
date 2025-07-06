use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_wasm_bindgen::{from_value, to_value};
use serde_json::{json, Map, Value};
use csv::ReaderBuilder;
use crate::error::{WasmError, WasmResultType};
use crate::utils::PerformanceTimer;

// Simple CSV Processing
#[wasm_bindgen]
pub fn parse_csv_enhanced(csv_content: &str, delimiter: Option<String>) -> JsValue {
    let timer = PerformanceTimer::new("parse_csv_enhanced".to_string());
    
    let result = (|| -> WasmResultType<Value> {
        let delimiter = delimiter.unwrap_or_else(|| ",".to_string());
        let delimiter_byte = delimiter.as_bytes()[0];
        
        let mut reader = ReaderBuilder::new()
            .delimiter(delimiter_byte)
            .flexible(true)
            .has_headers(true)
            .from_reader(csv_content.as_bytes());
        
        let headers: Vec<String> = reader.headers()
            .map_err(|e| WasmError::data_error(&format!("Failed to read headers: {}", e)))?
            .iter()
            .map(|h| h.to_string())
            .collect();
        
        let mut records = Vec::new();
        let mut error_count = 0;
        
        for (row_idx, result) in reader.records().enumerate() {
            match result {
                Ok(record) => {
                    let mut row_obj = Map::new();
                    for (col_idx, field) in record.iter().enumerate() {
                        let header = headers.get(col_idx)
                            .map(|h| h.clone())
                            .unwrap_or_else(|| format!("column_{}", col_idx));
                        
                        // Try to parse as number, fallback to string
                        let value = if let Ok(num) = field.parse::<f64>() {
                            Value::Number(serde_json::Number::from_f64(num).unwrap_or_else(|| {
                                serde_json::Number::from(0)
                            }))
                        } else {
                            Value::String(field.to_string())
                        };
                        
                        row_obj.insert(header, value);
                    }
                    records.push(Value::Object(row_obj));
                },
                Err(_) => {
                    error_count += 1;
                    if error_count > 10 {
                        return Err(WasmError::data_error("Too many parsing errors"));
                    }
                }
            }
        }
        
        Ok(json!({
            "data": records,
            "headers": headers,
            "row_count": records.len(),
            "error_count": error_count,
            "parsing_time_ms": timer.elapsed_ms()
        }))
    })();
    
    match result {
        Ok(parsed_data) => to_value(&parsed_data).unwrap(),
        Err(e) => to_value(&format!("Error: {}", e)).unwrap(),
    }
}

// Simple Object Comparison Helper
#[wasm_bindgen]
pub fn compare_objects_detailed(obj1: &JsValue, obj2: &JsValue) -> JsValue {
    let timer = PerformanceTimer::new("compare_objects_detailed".to_string());
    
    let result = (|| -> WasmResultType<Value> {
        let val1: Value = from_value(obj1.clone())
            .map_err(|e| WasmError::data_error(&format!("Invalid object 1: {}", e)))?;
        let val2: Value = from_value(obj2.clone())
            .map_err(|e| WasmError::data_error(&format!("Invalid object 2: {}", e)))?;
        
        let are_equal = val1 == val2;
        
        Ok(json!({
            "equal": are_equal,
            "comparison_time_ms": timer.elapsed_ms(),
            "object1_size": val1.to_string().len(),
            "object2_size": val2.to_string().len()
        }))
    })();
    
    match result {
        Ok(comparison_result) => to_value(&comparison_result).unwrap(),
        Err(e) => to_value(&format!("Error: {}", e)).unwrap(),
    }
} 