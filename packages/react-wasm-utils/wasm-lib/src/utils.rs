use wasm_bindgen::prelude::*;
use serde_wasm_bindgen::to_value;
// use std::time::Instant;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = performance)]
    fn now() -> f64;
}

// Performance measurement
#[wasm_bindgen]
pub struct PerformanceTimer {
    start: f64,
    name: String,
}

#[wasm_bindgen]
impl PerformanceTimer {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String) -> PerformanceTimer {
        PerformanceTimer {
            start: now(),
            name,
        }
    }
    
    pub fn elapsed_ms(&self) -> f64 {
        now() - self.start
    }
    
    pub fn finish(&self) -> String {
        format!("{}: {:.2}ms", self.name, self.elapsed_ms())
    }
}

// Memory utilities
#[wasm_bindgen]
pub fn get_memory_usage() -> JsValue {
    to_value(&"Memory info available through browser tools").unwrap()
} 