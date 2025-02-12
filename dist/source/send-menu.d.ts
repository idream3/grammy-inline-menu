import type { Api, Context as BaseContext } from 'https://deno.land/x/grammy@v1.34.0/mod.ts';
import type { Message } from 'grammy/types';
import type { MenuLike } from './menu-like.js';
/** Generic Method which is able to send a menu to a context (given a path where it is) */
export type SendMenuFunc<Context> = (menu: MenuLike<Context>, context: Context, path: string) => Promise<unknown>;
/**
 * Method which is able to send a menu to a chat.
 * Generated via `generateSendMenuToChatFunction`.
 */
export type SendMenuToChatFunction<Context> = (chatId: string | number, context: Context, other?: Readonly<Record<string, unknown>>) => Promise<Message>;
/**
 * Method which is able to edit a message in a chat into a menu.
 * Generated via `generateEditMessageIntoMenuFunction`.
 */
export type EditMessageIntoMenuFunction<Context> = (chatId: number | string, messageId: number, context: Context, other?: Readonly<Record<string, unknown>>) => Promise<Message | true>;
/**
 * Reply a menu to a context as a new message
 * @param menu menu to be shown
 * @param context current grammY context to reply the menu to it
 * @param path path of the menu
 * @param other optional additional options
 */
export declare function replyMenuToContext<Context extends BaseContext>(menu: MenuLike<Context>, context: Context, path: string, other?: Readonly<Record<string, unknown>>): Promise<Message.TextMessage | Message.LocationMessage | Message.InvoiceMessage | Message.DocumentMessage | Message.AudioMessage | Message.PhotoMessage | Message.VideoMessage>;
/**
 * Edit the context into the menu. If thats not possible the current message is deleted and a new message is replied
 * @param menu menu to be shown
 * @param context current grammY context to edit the menu into
 * @param path path of the menu
 * @param other optional additional options
 */
export declare function editMenuOnContext<Context extends BaseContext>(menu: MenuLike<Context>, context: Context, path: string, other?: Readonly<Record<string, unknown>>): Promise<boolean | Message.TextMessage | Message.LocationMessage | Message.InvoiceMessage | Message.DocumentMessage | Message.AudioMessage | Message.PhotoMessage | Message.VideoMessage | (import("grammy/types").Update.Edited & Message)>;
/**
 * Delete the message on the context.
 * If thats not possible the reply markup (keyboard) is removed. The user can not press any buttons on that old message.
 * @param context context of the message to be deleted
 */
export declare function deleteMenuFromContext<Context extends BaseContext>(context: Context): Promise<void>;
/**
 * Deletes to menu of the current context and replies a new one ensuring the menu is at the end of the chat.
 * @param menu menu to be shown
 * @param context current grammY context to send the menu to
 * @param path path of the menu
 * @param other optional additional options
 */
export declare function resendMenuToContext<Context extends BaseContext>(menu: MenuLike<Context>, context: Context, path: string, other?: Readonly<Record<string, unknown>>): Promise<Message.TextMessage | Message.LocationMessage | Message.InvoiceMessage | Message.DocumentMessage | Message.AudioMessage | Message.PhotoMessage | Message.VideoMessage>;
/**
 * Generate a function to send the menu towards a chat from external events
 * @param telegram The Telegram object to do the API calls with later on
 * @param menu menu to be shown
 * @param path path of the menu
 */
export declare function generateSendMenuToChatFunction<Context>(telegram: Api, menu: MenuLike<Context>, path: string): SendMenuToChatFunction<Context>;
/**
 * Edit the message into the the menu.
 * This fails when the current message is not compatible with the menu (you cant edit a media message into a text message and vice versa)
 * @param telegram The Telegram object to do the API calls with later on
 * @param menu menu to be shown
 * @param path path of the menu
 */
export declare function generateEditMessageIntoMenuFunction<Context>(telegram: Api, menu: MenuLike<Context>, path: string): EditMessageIntoMenuFunction<Context>;
