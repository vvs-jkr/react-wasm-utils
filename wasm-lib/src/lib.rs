use wasm_bindgen::prelude::*;

use serde_json::Value;

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn deep_equal(a: JsValue, b: JsValue) -> Result<bool, JsError> {
    let a_val: Value = serde_wasm_bindgen::from_value(a)?;
    let b_val: Value = serde_wasm_bindgen::from_value(b)?;

    Ok(a_val == b_val)
}

