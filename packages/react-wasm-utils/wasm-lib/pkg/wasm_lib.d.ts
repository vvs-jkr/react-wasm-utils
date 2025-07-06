/* tslint:disable */
/* eslint-disable */
export function parse_csv_enhanced(csv_content: string, delimiter?: string | null): any;
export function compare_objects_detailed(obj1: any, obj2: any): any;
export function get_memory_usage(): any;
export function init(): void;
export function health_check(): string;
export function get_version(): string;
export function get_features(): any;
export function deep_equal(a: any, b: any): boolean;
export function sort_by_key(data_val: any, key: string): any;
export function parse_csv(csv_data: string): any;
export class PerformanceTimer {
  free(): void;
  constructor(name: string);
  elapsed_ms(): number;
  finish(): string;
}
export class WasmResult {
  free(): void;
  constructor(success: boolean, data: any, error?: string | null);
  readonly success: boolean;
  readonly data: any;
  readonly error: string | undefined;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly parse_csv_enhanced: (a: number, b: number, c: number, d: number) => number;
  readonly compare_objects_detailed: (a: number, b: number) => number;
  readonly __wbg_wasmresult_free: (a: number, b: number) => void;
  readonly wasmresult_new: (a: number, b: number, c: number, d: number) => number;
  readonly wasmresult_success: (a: number) => number;
  readonly wasmresult_data: (a: number) => number;
  readonly wasmresult_error: (a: number, b: number) => void;
  readonly __wbg_performancetimer_free: (a: number, b: number) => void;
  readonly performancetimer_new: (a: number, b: number) => number;
  readonly performancetimer_elapsed_ms: (a: number) => number;
  readonly performancetimer_finish: (a: number, b: number) => void;
  readonly get_memory_usage: () => number;
  readonly init: () => void;
  readonly health_check: (a: number) => void;
  readonly get_version: (a: number) => void;
  readonly get_features: () => number;
  readonly deep_equal: (a: number, b: number, c: number) => void;
  readonly sort_by_key: (a: number, b: number, c: number, d: number) => void;
  readonly parse_csv: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: (a: number) => void;
  readonly __wbindgen_export_3: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
