import { getChoiceKeysFromChoices } from './understand-choices.js';
export function combineHideAndChoices(uniqueIdentifierPrefix, choices, hide) {
    if (!choices) {
        throw new TypeError('You have to specify `choices`');
    }
    return async (context, path) => {
        if (await hide?.(context, path)) {
            return true;
        }
        const match = new RegExp('/' + uniqueIdentifierPrefix + ':([^/]+)/?$')
            .exec(path);
        const toBeFound = match?.[1];
        if (!toBeFound) {
            throw new TypeError('could not read choice from path');
        }
        const choicesConstant = typeof choices === 'function'
            ? await choices(context)
            : choices;
        const choiceKeys = getChoiceKeysFromChoices(choicesConstant);
        const keyExists = choiceKeys.includes(toBeFound);
        if (!keyExists) {
            return true;
        }
        return false;
    };
}
//# sourceMappingURL=actions.js.map