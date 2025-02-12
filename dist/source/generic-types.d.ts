export type ConstOrPromise<T> = T | Promise<T>;
export type ContextFunc<Context, ReturnType> = (context: Context) => ConstOrPromise<ReturnType>;
export type ContextPathFunc<Context, ReturnType> = (context: Context, path: string) => ConstOrPromise<ReturnType>;
export type ConstOrContextFunc<Context, ReturnType> = ReturnType | ContextFunc<Context, ReturnType>;
export type ConstOrContextPathFunc<Context, ReturnType> = ReturnType | ContextPathFunc<Context, ReturnType>;
export type RegExpLike = {
    readonly source: string;
    readonly flags?: string;
};
export declare function isObject(something: unknown): something is Record<string, unknown>;
export declare function hasTruthyKey(something: unknown, key: string): boolean;
export declare function isRegExpExecArray(something: unknown): something is RegExpExecArray;
export declare function filterNonNullable<T>(): (o: T) => o is NonNullable<T>;
