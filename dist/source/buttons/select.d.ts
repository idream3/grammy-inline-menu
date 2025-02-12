import { type ManyChoicesOptions } from '../choices/index.js';
import type { ConstOrPromise } from '../generic-types.js';
import type { CallbackButtonTemplate } from '../keyboard.js';
export type IsSetFunction<Context> = (context: Context, key: string) => ConstOrPromise<boolean>;
export type SetFunction<Context> = (context: Context, key: string, newState: boolean) => ConstOrPromise<string | boolean>;
export type FormatStateFunction<Context> = (context: Context, textResult: string, state: boolean, key: string) => ConstOrPromise<string>;
export interface SelectOptions<Context> extends ManyChoicesOptions<Context> {
    /**
     * Show an emoji for the choices currently false.
     * This is helpful to show the user there can be selected multiple choices at the same time.
     */
    readonly showFalseEmoji?: boolean;
    /** Function returning the current state of a given choice. */
    readonly isSet: IsSetFunction<Context>;
    /**
     * Function which is called when a user selects a choice.
     * Arguments include the choice (`key`) and the new `state` which is helpful for multiple toggles.
     */
    readonly set: SetFunction<Context>;
    /** Format the button text which is visible to the user. */
    readonly formatState?: FormatStateFunction<Context>;
}
export declare function generateSelectButtons<Context>(uniqueIdentifierPrefix: string, options: SelectOptions<Context>): (context: Context, path: string) => Promise<CallbackButtonTemplate[][]>;
