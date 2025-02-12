import type { InlineKeyboardButton as TelegramInlineKeyboardButton } from 'grammy/types';
import type { ReadonlyDeep } from 'type-fest';
import { type ConstOrContextPathFunc, type ContextPathFunc } from './generic-types.js';
export type CallbackButtonTemplate = {
    readonly text: string;
    readonly relativePath: string;
};
export type InlineKeyboardButton = ReadonlyDeep<TelegramInlineKeyboardButton>;
export type InlineKeyboard = ReadonlyArray<readonly InlineKeyboardButton[]>;
export type ButtonTemplate = CallbackButtonTemplate | InlineKeyboardButton;
export type ButtonTemplateRow = readonly ButtonTemplate[];
type UncreatedTemplate<Context> = ConstOrContextPathFunc<Context, ButtonTemplate | undefined>;
type ButtonTemplateRowGenerator<Context> = ContextPathFunc<Context, ButtonTemplateRow[]>;
export declare class Keyboard<Context> {
    #private;
    addCreator(creator: ButtonTemplateRowGenerator<Context>): void;
    add(joinLastRow: boolean, ...buttons: ReadonlyArray<UncreatedTemplate<Context>>): void;
    render(context: Context, path: string): Promise<InlineKeyboard>;
}
export {};
