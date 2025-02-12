export type PrefixOptions = {
    /**
     * Emoji which is used as prefix when true.
     *
     * Defaults to ✅
     */
    readonly prefixTrue?: string;
    /**
     * Emoji which is used as prefix when false.
     *
     * Defaults to 🚫
     */
    readonly prefixFalse?: string;
    /** Do not show the prefix when true. */
    readonly hideTrueEmoji?: boolean;
    /** Do not show the prefix when false. */
    readonly hideFalseEmoji?: boolean;
};
export declare const emojiTrue = "\u2705";
export declare const emojiFalse = "\uD83D\uDEAB";
/**
 * Prefixes the text with a true / false emoji.
 * Can also be used with custom prefixes.
 * @param text text which should receive the prefix.
 * @param prefix true / false or a custom (string) prefix.
 * @param options optional options to customize emojis
 */
export declare function prefixEmoji(text: string, prefix: string | boolean | undefined, options?: PrefixOptions): string;
/**
 * Prefixes the text with the prefix.
 * If the prefix is undefined or '' the raw text is returned.
 * @param text text which should receive the prefix.
 * @param prefix prefix to end up in front of the text.
 */
export declare function prefixText(text: string, prefix: string | undefined): string;
