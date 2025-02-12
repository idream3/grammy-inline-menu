import type { ConstOrPromise, ContextPathFunc } from '../generic-types.js';
import type { CallbackButtonTemplate } from '../keyboard.js';
import type { SingleButtonOptions } from './basic.js';
export type FormatStateFunction<Context> = (context: Context, text: string, state: boolean, path: string) => ConstOrPromise<string>;
export interface ToggleOptions<Context> extends SingleButtonOptions<Context> {
    /** Function returning the current state. */
    readonly isSet: ContextPathFunc<Context, boolean>;
    /** Function which is called when a user presses the button. */
    readonly set: (context: Context, newState: boolean, path: string) => ConstOrPromise<string | boolean>;
    /** Format the button text which is visible to the user. */
    readonly formatState?: FormatStateFunction<Context>;
}
export declare function generateToggleButton<Context>(uniqueIdentifierPrefix: string, options: ToggleOptions<Context>): ContextPathFunc<Context, CallbackButtonTemplate | undefined>;
