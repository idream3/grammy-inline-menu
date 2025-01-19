export const emojiTrue = '✅';
export const emojiFalse = '🚫';
/**
 * Prefixes the text with a true / false emoji.
 * Can also be used with custom prefixes.
 * @param text text which should receive the prefix.
 * @param prefix true / false or a custom (string) prefix.
 * @param options optional options to customize emojis
 */
export function prefixEmoji(text, prefix, options = {}) {
    const internalOptions = {
        ...options,
        prefixTrue: options.prefixTrue ?? emojiTrue,
        prefixFalse: options.prefixFalse ?? emojiFalse,
    };
    const prefixContent = applyOptionsToPrefix(prefix, internalOptions);
    return prefixText(text, prefixContent);
}
function applyOptionsToPrefix(prefix, options) {
    const { prefixFalse, prefixTrue, hideFalseEmoji, hideTrueEmoji, } = options;
    if (prefix === true) {
        if (hideTrueEmoji) {
            return undefined;
        }
        return prefixTrue;
    }
    if (prefix === false) {
        if (hideFalseEmoji) {
            return undefined;
        }
        return prefixFalse;
    }
    return prefix;
}
/**
 * Prefixes the text with the prefix.
 * If the prefix is undefined or '' the raw text is returned.
 * @param text text which should receive the prefix.
 * @param prefix prefix to end up in front of the text.
 */
export function prefixText(text, prefix) {
    if (!prefix) {
        return text;
    }
    return `${prefix} ${text}`;
}
//# sourceMappingURL=prefix.js.map