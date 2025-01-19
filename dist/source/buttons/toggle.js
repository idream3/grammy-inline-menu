import { prefixEmoji } from '../prefix.js';
export function generateToggleButton(uniqueIdentifierPrefix, options) {
    const formatFunction = options.formatState
        ?? ((_, text, state) => prefixEmoji(text, state));
    return async (context, path) => {
        if (await options.hide?.(context, path)) {
            return undefined;
        }
        const textResult = typeof options.text === 'function'
            ? await options.text(context, path)
            : options.text;
        const state = await options.isSet(context, path);
        return {
            text: await formatFunction(context, textResult, state, path),
            relativePath: uniqueIdentifierPrefix + ':' + (state ? 'false' : 'true'),
        };
    };
}
//# sourceMappingURL=toggle.js.map