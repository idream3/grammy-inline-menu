import type { ContextPathFunc, RegExpLike } from './generic-types.js';
export type ActionFunc<Context> = ContextPathFunc<Context, string | boolean>;
export type ButtonAction<Context> = {
    readonly trigger: RegExpLike;
    readonly doFunction: ActionFunc<Context>;
};
export declare class ActionHive<Context> {
    #private;
    add(trigger: RegExpLike, doFunction: ActionFunc<Context>, hide: undefined | ContextPathFunc<Context, boolean>): void;
    list(path: RegExpLike): ReadonlySet<ButtonAction<Context>>;
}
