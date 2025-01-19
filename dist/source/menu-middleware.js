import { Composer } from 'grammy';
import { combinePath, combineTrigger, createRootMenuTrigger } from './path.js';
import { editMenuOnContext, replyMenuToContext, } from './send-menu.js';
export class MenuMiddleware {
    rootTrigger;
    rootMenu;
    options;
    #sendMenu;
    #responder;
    constructor(rootTrigger, rootMenu, options = {}) {
        this.rootTrigger = rootTrigger;
        this.rootMenu = rootMenu;
        this.options = options;
        const rootTriggerRegex = createRootMenuTrigger(rootTrigger);
        this.#responder = createResponder(rootTriggerRegex, () => true, rootMenu);
        this.#sendMenu = options.sendMenu ?? editMenuOnContext;
    }
    /**
     * Send the root menu to the context. Shortcut for `replyMenuToContext(…)`
     * @param context Context where the root menu should be replied to
     * @example
     * const menuMiddleware = new MenuMiddleware('/', menuTemplate)
     * bot.command('start', async ctx => menuMiddleware.replyToContext(ctx))
     */
    async replyToContext(context, path = this.rootTrigger) {
        if (typeof path === 'function') {
            // Happens when a JS User does this as next is the second argument and not a string:
            // ctx.command('start', menuMiddleware.replyToContext)
            throw new TypeError('Do not supply this as a middleware directly. Supply it as a function `ctx => menuMiddleware.replyToContext(ctx)`');
        }
        if (typeof path !== 'string') {
            // Happens when the rootTrigger is a RegExp
            throw new TypeError('You have to specify an absolute path explicitly as a string in the second argument.');
        }
        const { match, responder } = await getLongestMatchMenuResponder(context, path, this.#responder);
        if (!match) {
            throw new Error('There is no menu which works with your supplied path: ' + path);
        }
        return replyMenuToContext(responder.menu, context, path);
    }
    /**
     * The tree structure can be shown for debugging purposes.
     * You can take a look on the menu you created.
     */
    tree() {
        return 'Menu Tree\n' + responderTree(this.#responder);
    }
    middleware() {
        const composer = new Composer();
        const trigger = new RegExp(this.#responder.trigger.source, this.#responder.trigger.flags);
        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
        composer.callbackQuery(trigger, async (context) => {
            const path = context.callbackQuery.data;
            let target = path;
            if (!path.endsWith('/')) {
                const { match, responder } = await getLongestMatchActionResponder(context, path, this.#responder);
                if (match?.[0] && responder.type === 'action') {
                    // @ts-expect-error grammy has some more specific type there
                    context.match = match;
                    const afterwardsTarget = await responder.do(context, match[0]);
                    if (typeof afterwardsTarget === 'string' && afterwardsTarget) {
                        target = combinePath(path, afterwardsTarget);
                    }
                    else if (afterwardsTarget === true) {
                        target = combinePath(path, '.');
                    }
                    else if (afterwardsTarget === false) {
                        target = undefined;
                    }
                    else {
                        throw new Error('You have to return in your do function if you want to update the menu afterwards or not. If not just use return false.');
                    }
                }
            }
            if (target) {
                const { match, responder } = await getLongestMatchMenuResponder(context, target, this.#responder);
                if (!match?.[0]) {
                    // TODO: think about using next() in this case?
                    throw new Error(`There is no menu "${target}" which can be reached in this menu`);
                }
                // @ts-expect-error grammy has some more specific type there
                context.match = match;
                const targetPath = match[0];
                // @ts-expect-error menu context is not exactly the context type (callback query context vs base context)
                await this.#sendMenu(responder.menu, context, targetPath);
                await context.answerCallbackQuery()
                    .catch(catchCallbackOld);
            }
        });
        return composer.middleware();
    }
}
function catchCallbackOld(error) {
    if (error instanceof Error
        && error.message.includes('query is too old and response timeout expired')) {
        // ignore
        return;
    }
    throw error;
}
function responderMatch(responder, path) {
    return new RegExp(responder.trigger.source, responder.trigger.flags)
        .exec(path) ?? undefined;
}
async function getLongestMatchMenuResponder(context, path, current) {
    for (const sub of current.submenuResponders) {
        const match = responderMatch(sub, path);
        if (!match?.[0]) {
            continue;
        }
        // Users expect context.match to contain the relevant match
        context.match = match;
        // eslint-disable-next-line no-await-in-loop
        if (await sub.canEnter(context, match[0])) {
            return getLongestMatchMenuResponder(context, path, sub);
        }
    }
    const match = responderMatch(current, path);
    return { match, responder: current };
}
async function getLongestMatchActionResponder(context, path, current) {
    const currentMatch = responderMatch(current, path);
    for (const sub of current.submenuResponders) {
        const match = responderMatch(sub, path);
        if (!match?.[0]) {
            continue;
        }
        // Users expect context.match to contain the relevant match
        context.match = match;
        // eslint-disable-next-line no-await-in-loop
        if (await sub.canEnter(context, match[0])) {
            return getLongestMatchActionResponder(context, path, sub);
        }
        return { match: currentMatch, responder: current };
    }
    for (const sub of current.actionResponders) {
        const match = responderMatch(sub, path);
        if (!match) {
            continue;
        }
        return { match, responder: sub };
    }
    return { match: currentMatch, responder: current };
}
function createResponder(menuTrigger, canEnter, menu) {
    const actionResponders = [...menu.renderActionHandlers(menuTrigger)]
        .map(({ trigger, doFunction }) => ({
        type: 'action',
        trigger,
        do: doFunction,
    }));
    const submenuResponders = [...menu.listSubmenus()]
        .map((submenu) => {
        const submenuTrigger = combineTrigger(menuTrigger, submenu.trigger);
        const canEnterSubmenu = async (context, path) => {
            if (await submenu.hide?.(context, path)) {
                return false;
            }
            return true;
        };
        return createResponder(submenuTrigger, canEnterSubmenu, submenu.menu);
    });
    return {
        type: 'menu',
        trigger: menuTrigger,
        canEnter,
        menu,
        actionResponders,
        submenuResponders,
    };
}
function responderTree(responder, indention = '') {
    let text = treeLine(indention, responder.type, responder.trigger.source);
    const subIndention = '  ' + indention;
    for (const action of responder.actionResponders) {
        text += treeLine(subIndention, action.type, action.trigger.source);
    }
    for (const submenu of responder.submenuResponders) {
        text += responderTree(submenu, subIndention);
    }
    return text;
}
function treeLine(indention, type, regexSource) {
    let text = indention + type;
    const offset = Math.max(1, 30 - text.length);
    for (let i = 0; i < offset; i++) {
        text += ' ';
    }
    text += regexSource
        .replaceAll('\\/', '/')
        .replace(/^\^/, '')
        .replace(/\$$/, '');
    text += '\n';
    return text;
}
//# sourceMappingURL=menu-middleware.js.map