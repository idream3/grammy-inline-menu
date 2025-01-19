import type { ConstOrContextPathFunc } from '../generic-types.js';
import type { CallbackButtonTemplate } from '../keyboard.js';
export declare function createBackMainMenuButtons<Context>(backButtonText?: ConstOrContextPathFunc<Context, string>, mainMenuButtonText?: ConstOrContextPathFunc<Context, string>): (context: Context, path: string) => Promise<CallbackButtonTemplate[][]>;
