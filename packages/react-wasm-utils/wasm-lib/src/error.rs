use thiserror::Error;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Error, Debug, Serialize, Deserialize)]
pub enum WasmError {
    #[error("Math error: {message}")]
    MathError { message: String },
    
    #[error("Data processing error: {message}")]
    DataError { message: String },
    
    #[error("Graphics error: {message}")]
    GraphicsError { message: String },
    
    #[error("Memory error: {message}")]
    MemoryError { message: String },
    
    #[error("Serialization error: {message}")]
    SerializationError { message: String },
    
    #[error("Invalid input: {message}")]
    ValidationError { message: String },
}

impl WasmError {
    pub fn math_error(msg: &str) -> Self {
        WasmError::MathError { message: msg.to_string() }
    }
    
    pub fn data_error(msg: &str) -> Self {
        WasmError::DataError { message: msg.to_string() }
    }
    
    pub fn graphics_error(msg: &str) -> Self {
        WasmError::GraphicsError { message: msg.to_string() }
    }
    
    pub fn memory_error(msg: &str) -> Self {
        WasmError::MemoryError { message: msg.to_string() }
    }
    
    pub fn validation_error(msg: &str) -> Self {
        WasmError::ValidationError { message: msg.to_string() }
    }
}

#[wasm_bindgen]
pub struct WasmResult {
    success: bool,
    data: JsValue,
    error: Option<String>,
}

#[wasm_bindgen]
impl WasmResult {
    #[wasm_bindgen(constructor)]
    pub fn new(success: bool, data: JsValue, error: Option<String>) -> WasmResult {
        WasmResult { success, data, error }
    }
    
    #[wasm_bindgen(getter)]
    pub fn success(&self) -> bool {
        self.success
    }
    
    #[wasm_bindgen(getter)]
    pub fn data(&self) -> JsValue {
        self.data.clone()
    }
    
    #[wasm_bindgen(getter)]
    pub fn error(&self) -> Option<String> {
        self.error.clone()
    }
}

pub type WasmResultType<T> = Result<T, WasmError>; 