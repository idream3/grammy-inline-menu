function choicesIsArray(choices) {
    return Array.isArray(choices);
}
function choicesIsMap(choices) {
    return choices instanceof Map;
}
export function getChoiceKeysFromChoices(choices) {
    if (choicesIsArray(choices)) {
        return choices.map(String);
    }
    if (choicesIsMap(choices)) {
        return [...choices.keys()].map(String);
    }
    return Object.keys(choices);
}
export function getChoiceTextByKey(choices, key) {
    if (choicesIsArray(choices)) {
        return key;
    }
    if (choicesIsMap(choices)) {
        return choices.get(key) ?? key;
    }
    const choice = choices[key];
    if (choice) {
        return choice;
    }
    return key;
}
export function ensureCorrectChoiceKeys(uniqueIdentifierPrefix, path, choiceKeys) {
    const containSlashExample = choiceKeys.find(o => o.includes('/'));
    if (containSlashExample) {
        throw new Error(`Choices can not contain '/'. Found '${containSlashExample}' in unique identifier '${uniqueIdentifierPrefix}' at path '${path}'.`);
    }
}
//# sourceMappingURL=understand-choices.js.map