import { strictEqual } from 'node:assert';
import { test } from 'node:test';
import { Bot } from 'grammy';
import { MenuMiddleware } from '../../source/menu-middleware.js';
await test('menu-middleware empty-menu non callback queries are passing through', async (t) => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu);
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(mm.middleware());
    const passes = t.mock.fn();
    bot.use(passes);
    await bot.handleUpdate({
        update_id: 666,
        message: {
            text: '42',
            chat: {},
            from: {},
            message_id: 666,
            date: 666,
        },
    });
    strictEqual(passes.mock.callCount(), 1);
});
await test('menu-middleware empty-menu irrelevant callback queries are passing through', async (t) => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu);
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(mm.middleware());
    const passes = t.mock.fn();
    bot.use(passes);
    await bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: '666',
        },
    });
    strictEqual(passes.mock.callCount(), 1);
});
await test('menu-middleware empty-menu default root path is responded', async (t) => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const sendMenu = t.mock.fn(async (_menu, _context, path) => {
        strictEqual(path, '/');
    });
    const mm = new MenuMiddleware('/', menu, { sendMenu });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    const answerCallbackQuery = t.mock.fn(async () => true);
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = answerCallbackQuery;
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
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
await test('menu-middleware empty-menu custom root path is responded', async (t) => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const sendMenu = t.mock.fn(async (_menu, _context, path) => {
        strictEqual(path, 'custom/');
    });
    const mm = new MenuMiddleware('custom/', menu, { sendMenu });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    const answerCallbackQuery = t.mock.fn(async () => true);
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = answerCallbackQuery;
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
            data: 'custom/',
        },
    });
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
await test('menu-middleware empty-menu custom regex root path is responded', async (t) => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const sendMenu = t.mock.fn(async (_menu, _context, path) => {
        strictEqual(path, 'tree42/');
    });
    const mm = new MenuMiddleware(/^tree(\d+)\//, menu, { sendMenu });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    const answerCallbackQuery = t.mock.fn(async () => true);
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = answerCallbackQuery;
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
            data: 'tree42/',
        },
    });
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
await test('menu-middleware empty-menu default root path does not trigger custom root path', async (t) => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('custom/', menu);
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(mm.middleware());
    const passes = t.mock.fn();
    bot.use(passes);
    await bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: '/',
        },
    });
    strictEqual(passes.mock.callCount(), 1);
});
await test('menu-middleware empty-menu not existing path below is responded with root menu', async (t) => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const sendMenu = t.mock.fn(async (_menu, _context, path) => {
        strictEqual(path, '/');
    });
    const mm = new MenuMiddleware('/', menu, { sendMenu });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    const answerCallbackQuery = t.mock.fn(async () => true);
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = answerCallbackQuery;
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
            data: '/what',
        },
    });
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
//# sourceMappingURL=empty-menu.js.map