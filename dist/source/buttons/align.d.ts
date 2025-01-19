export declare function clamp(value: number, min: number, max: number): number;
export declare function getRowsOfButtons<T>(buttons: readonly T[], columns?: number, maxRows?: number, page?: number): T[][];
export declare function getButtonsOfPage<T>(buttons: readonly T[], columns?: number, maxRows?: number, page?: number): T[];
export declare function getButtonsAsRows<T>(buttons: readonly T[], columns?: number): T[][];
export declare function maximumButtonsPerPage(columns?: number, maxRows?: number): number;
