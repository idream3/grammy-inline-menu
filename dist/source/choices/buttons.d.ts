import type { CallbackButtonTemplate } from '../keyboard.js';
import type { Choices, ChoiceTextFunc, ManyChoicesOptions } from './types.js';
export declare function generateChoicesButtons<Context>(uniqueIdentifierPrefix: string, isSubmenu: boolean, options: ManyChoicesOptions<Context>): (context: Context, path: string) => Promise<CallbackButtonTemplate[][]>;
export declare function generateChoicesPaginationButtons<Context>(uniqueIdentifierPrefix: string, choiceKeys: number, currentPage: number | undefined, options: ManyChoicesOptions<Context>): CallbackButtonTemplate[];
export declare function createChoiceTextFunction<Context>(choices: Choices, buttonText: undefined | ChoiceTextFunc<Context>): ChoiceTextFunc<Context>;
