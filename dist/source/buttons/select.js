import { createChoiceTextFunction, generateChoicesPaginationButtons, } from '../choices/index.js';
import { ensureCorrectChoiceKeys, getChoiceKeysFromChoices, } from '../choices/understand-choices.js';
import { prefixEmoji } from '../prefix.js';
import { getButtonsAsRows, getButtonsOfPage } from './align.js';
export function generateSelectButtons(uniqueIdentifierPrefix, options) {
    return async (context, path) => {
        if (await options.hide?.(context, path)) {
            return [];
        }
        const choicesConstant = typeof options.choices === 'function'
            ? await options.choices(context)
            : options.choices;
        const choiceKeys = getChoiceKeysFromChoices(choicesConstant);
        ensureCorrectChoiceKeys(uniqueIdentifierPrefix, path, choiceKeys);
        const textFunction = createChoiceTextFunction(choicesConstant, options.buttonText);
        const formatFunction = options.formatState
            ?? ((_, textResult, state) => prefixEmoji(textResult, state, {
                hideFalseEmoji: !options.showFalseEmoji,
            }));
        const currentPage = await options.getCurrentPage?.(context);
        const keysOfPage = getButtonsOfPage(choiceKeys, options.columns, options.maxRows, currentPage);
        const buttonsOfPage = await Promise.all(keysOfPage
            .map(async (key) => {
            const textResult = await textFunction(context, key);
            const state = await options.isSet(context, key);
            const text = await formatFunction(context, textResult, state, key);
            const dropinLetter = state ? 'F' : 'T';
            const relativePath = uniqueIdentifierPrefix + dropinLetter + ':' + key;
            return { text, relativePath };
        }));
        const rows = getButtonsAsRows(buttonsOfPage, options.columns);
        if (options.setPage) {
            rows.push(generateChoicesPaginationButtons(uniqueIdentifierPrefix, choiceKeys.length, currentPage, options));
        }
        return rows;
    };
}
//# sourceMappingURL=select.js.map