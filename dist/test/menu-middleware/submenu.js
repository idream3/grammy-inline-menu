import { strictEqual } from 'node:assert';
import { test } from 'node:test';
import { Bot } from 'grammy';
import { MenuMiddleware } from '../../source/menu-middleware.js';
await test('menu-middleware submenu respond with main menu on root path', async () => {
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'submenu',
        renderKeyboard: () => [],
    };
    const submenu = {
        trigger: /submenu\//,
        hide: () => false,
        menu: submenuMenu,
    };
    const menu = {
        listSubmenus: () => new Set([submenu]),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu, {
        async sendMenu(menu, _context, path) {
            strictEqual(menu.listSubmenus().size, 1);
            strictEqual(path, '/');
        },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = async () => true;
        return next();
    });
    bot.use(mm.middleware());
    bot.use(() => {
        throw new Error('dont call this function');
    });
    await bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: '/',
        },
    });
});
await test('menu-middleware submenu respond with submenu when not hidden', async () => {
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'submenu',
        renderKeyboard: () => [],
    };
    const submenu = {
        trigger: /submenu\//,
        hide: () => false,
        menu: submenuMenu,
    };
    const menu = {
        listSubmenus: () => new Set([submenu]),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu, {
        async sendMenu(menu, _context, path) {
            strictEqual(menu.listSubmenus().size, 0);
            strictEqual(path, '/submenu/');
        },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = async () => true;
        return next();
    });
    bot.use(mm.middleware());
    bot.use(() => {
        throw new Error('dont call this function');
    });
    await bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: '/submenu/',
        },
    });
});
await test('menu-middleware submenu respond with submenu when no hide function', async () => {
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'submenu',
        renderKeyboard: () => [],
    };
    const submenu = {
        trigger: /submenu\//,
        hide: undefined,
        menu: submenuMenu,
    };
    const menu = {
        listSubmenus: () => new Set([submenu]),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu, {
        async sendMenu(menu, _context, path) {
            strictEqual(menu.listSubmenus().size, 0);
            strictEqual(path, '/submenu/');
        },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = async () => true;
        return next();
    });
    bot.use(mm.middleware());
    bot.use(() => {
        throw new Error('dont call this function');
    });
    await bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: '/submenu/',
        },
    });
});
await test('menu-middleware submenu respond with main menu when submenu hidden', async () => {
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'submenu',
        renderKeyboard: () => [],
    };
    const submenu = {
        trigger: /submenu\//,
        hide: () => true,
        menu: submenuMenu,
    };
    const menu = {
        listSubmenus: () => new Set([submenu]),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu, {
        async sendMenu(menu, _context, path) {
            strictEqual(menu.listSubmenus().size, 1);
            strictEqual(path, '/');
        },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = async () => true;
        return next();
    });
    bot.use(mm.middleware());
    bot.use(() => {
        throw new Error('dont call this function');
    });
    await bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: '/submenu/',
        },
    });
});
//# sourceMappingURL=submenu.js.map