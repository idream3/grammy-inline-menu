import type { Choices } from './types.js';
export declare function getChoiceKeysFromChoices(choices: Choices): string[];
export declare function getChoiceTextByKey(choices: Choices, key: string): string;
export declare function ensureCorrectChoiceKeys(uniqueIdentifierPrefix: string, path: string, choiceKeys: readonly string[]): void;
