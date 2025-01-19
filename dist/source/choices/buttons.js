import { getButtonsAsRows, getButtonsOfPage, maximumButtonsPerPage, } from '../buttons/align.js';
import { createPaginationChoices } from '../buttons/pagination.js';
import { ensureCorrectChoiceKeys, getChoiceKeysFromChoices, getChoiceTextByKey, } from './understand-choices.js';
export function generateChoicesButtons(uniqueIdentifierPrefix, isSubmenu, options) {
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
        const currentPage = await options.getCurrentPage?.(context);
        const keysOfPage = getButtonsOfPage(choiceKeys, options.columns, options.maxRows, currentPage);
        const buttonsOfPage = await Promise.all(keysOfPage.map(async (key) => {
            const text = await textFunction(context, key);
            const relativePath = uniqueIdentifierPrefix + ':' + key
                + (isSubmenu ? '/' : '');
            return { text, relativePath };
        }));
        const rows = getButtonsAsRows(buttonsOfPage, options.columns);
        if (options.setPage) {
            rows.push(generateChoicesPaginationButtons(uniqueIdentifierPrefix, choiceKeys.length, currentPage, options));
        }
        return rows;
    };
}
export function generateChoicesPaginationButtons(uniqueIdentifierPrefix, choiceKeys, currentPage, options) {
    const entriesPerPage = maximumButtonsPerPage(options.columns, options.maxRows);
    const totalPages = choiceKeys / entriesPerPage;
    const pageRecord = createPaginationChoices(totalPages, currentPage);
    const pageKeys = Object.keys(pageRecord).map(Number);
    const pageButtons = pageKeys
        .map((page) => ({
        relativePath: `${uniqueIdentifierPrefix}P:${page}`,
        text: pageRecord[page],
    }));
    return pageButtons;
}
export function createChoiceTextFunction(choices, buttonText) {
    if (buttonText) {
        return buttonText;
    }
    return (_, key) => getChoiceTextByKey(choices, key);
}
//# sourceMappingURL=buttons.js.map