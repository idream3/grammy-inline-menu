import type { ConstOrContextFunc, ContextPathFunc } from '../generic-types.js';
import type { Choices } from './types.js';
export declare function combineHideAndChoices<Context>(uniqueIdentifierPrefix: string, choices: ConstOrContextFunc<Context, Choices>, hide: undefined | ContextPathFunc<Context, boolean>): ContextPathFunc<Context, boolean>;
