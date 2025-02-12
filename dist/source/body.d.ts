import type { InputFile } from 'https://deno.land/x/grammy@v1.34.0/mod.ts';
import type { LabeledPrice, Location, MessageEntity, ParseMode, Venue } from 'grammy/types';
import type { ReadonlyDeep } from 'type-fest';
export type Body = string | TextBody | MediaBody | LocationBody | VenueBody | InvoiceBody;
export declare const MEDIA_TYPES: readonly ["animation", "audio", "document", "photo", "video"];
export type MediaType = typeof MEDIA_TYPES[number];
export type TextBody = {
    readonly text: string;
    readonly entities?: MessageEntity[];
    readonly parse_mode?: ParseMode;
    readonly disable_web_page_preview?: boolean;
};
export type MediaBody = {
    readonly type: MediaType;
    readonly media: string | InputFile;
    /** Caption */
    readonly text?: string;
    readonly entities?: MessageEntity[];
    readonly parse_mode?: ParseMode;
};
export type LocationBody = {
    readonly location: Readonly<Location>;
    readonly live_period?: number;
};
export type VenueBody = {
    readonly venue: ReadonlyDeep<Venue>;
};
export type InvoiceBody = {
    readonly invoice: {
        readonly title: string;
        readonly description: string;
        readonly payload: string;
        readonly currency: string;
        readonly prices: ReadonlyArray<Readonly<LabeledPrice>>;
    };
};
export declare function isTextBody(body: unknown): body is string | TextBody;
export declare function isMediaBody(body: unknown): body is MediaBody;
export declare function isLocationBody(body: unknown): body is LocationBody;
export declare function isVenueBody(body: unknown): body is VenueBody;
export declare function isInvoiceBody(body: unknown): body is InvoiceBody;
export declare function getBodyText(body: TextBody | string): string;
