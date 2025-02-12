import { type Context as BaseContext } from 'https://deno.land/x/grammy@v1.34.0/mod.ts';
import type { RegExpLike } from './generic-types.js';
import type { MenuLike } from './menu-like.js';
import { type SendMenuFunc } from './send-menu.js';
export type Options<Context> = {
    /**
     * Function which is used to send and update the menu.
     *
     * Defaults to `editMenuOnContext`
     */
    readonly sendMenu?: SendMenuFunc<Context>;
};
export declare class MenuMiddleware<Context extends BaseContext> {
    #private;
    readonly rootTrigger: string | RegExpLike;
    readonly rootMenu: MenuLike<Context>;
    readonly options: Options<Context>;
    constructor(rootTrigger: string | RegExpLike, rootMenu: MenuLike<Context>, options?: Options<Context>);
    /**
     * Send the root menu to the context. Shortcut for `replyMenuToContext(…)`
     * @param context Context where the root menu should be replied to
     * @example
     * const menuMiddleware = new MenuMiddleware('/', menuTemplate)
     * bot.command('start', async ctx => menuMiddleware.replyToContext(ctx))
     */
    replyToContext(context: Context, path?: string | RegExpLike): Promise<import("@grammyjs/types").Message.TextMessage | import("@grammyjs/types").Message.LocationMessage | import("@grammyjs/types").Message.InvoiceMessage | import("@grammyjs/types").Message.DocumentMessage | import("@grammyjs/types").Message.AudioMessage | import("@grammyjs/types").Message.PhotoMessage | import("@grammyjs/types").Message.VideoMessage>;
    /**
     * The tree structure can be shown for debugging purposes.
     * You can take a look on the menu you created.
     */
    tree(): string;
    middleware(): (context: Context, next: () => Promise<void>) => void;
}
