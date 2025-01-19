import { rejects, strictEqual } from 'node:assert';
import { test } from 'node:test';
import { Bot } from 'grammy';
import { MenuMiddleware } from '../../source/menu-middleware.js';
await test('menu-middleware action is run without updating menu afterwards', async (t) => {
    const action = {
        trigger: /^\/what$/,
        doFunction(context, path) {
            strictEqual(context.match[0], '/what');
            strictEqual(context.match[1], undefined);
            strictEqual(path, '/what');
            return false;
        },
    };
    const mock = t.mock.method(action, 'doFunction');
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu, {
        async sendMenu() {
            throw new Error('dont open the menu');
        },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
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
    strictEqual(mock.mock.callCount(), 1);
});
await test('menu-middleware action is run and updating menu afterwards with path', async (t) => {
    const action = {
        trigger: /^\/what$/,
        doFunction(context, path) {
            strictEqual(context.match[0], '/what');
            strictEqual(context.match[1], undefined);
            strictEqual(path, '/what');
            return '.';
        },
    };
    const mock = t.mock.method(action, 'doFunction');
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
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
    strictEqual(mock.mock.callCount(), 1);
});
await test('menu-middleware action is run and updating menu afterwards with true', async (t) => {
    const action = {
        trigger: /^\/what$/,
        doFunction(context, path) {
            strictEqual(context.match[0], '/what');
            strictEqual(context.match[1], undefined);
            strictEqual(path, '/what');
            return true;
        },
    };
    const mock = t.mock.method(action, 'doFunction');
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
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
    strictEqual(mock.mock.callCount(), 1);
});
await test('menu-middleware action returns non existing path afterwards throws Error', async () => {
    const action = {
        trigger: /^custom\/what$/,
        doFunction: () => '/foo/',
    };
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('custom/', menu, {
        async sendMenu() {
            throw new Error('dont send main menu');
        },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(mm.middleware());
    bot.use(() => {
        throw new Error('dont call this function');
    });
    await rejects(async () => bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: 'custom/what',
        },
    }), {
        message: /There is no menu "\/foo\/" which can be reached in this menu$/,
    });
});
await test('menu-middleware action not existing action updates menu', async (t) => {
    const action = {
        trigger: /^\/what$/,
        doFunction() {
            throw new Error('not the correct action');
        },
    };
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
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
            data: '/where',
        },
    });
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
await test('menu-middleware action in submenu is run', async (t) => {
    const action = {
        trigger: /^\/submenu\/what$/,
        doFunction(context, path) {
            strictEqual(context.match[0], '/submenu/what');
            strictEqual(context.match[1], undefined);
            strictEqual(path, '/submenu/what');
            return false;
        },
    };
    const mock = t.mock.method(action, 'doFunction');
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set([action]),
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
        async sendMenu() {
            throw new Error('dont open the menu');
        },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
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
            data: '/submenu/what',
        },
    });
    strictEqual(mock.mock.callCount(), 1);
});
await test('menu-middleware action not existing action in submenu updates submenu', async (t) => {
    const action = {
        trigger: /^\/submenu\/what$/,
        doFunction() {
            throw new Error('not the correct action');
        },
    };
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set([action]),
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
    const sendMenu = t.mock.fn(async (_menu, _context, path) => {
        strictEqual(path, '/submenu/');
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
            data: '/submenu/where',
        },
    });
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
await test('menu-middleware action in hidden submenu updates main menu', async (t) => {
    const action = {
        trigger: /^\/submenu\/what$/,
        doFunction() {
            throw new Error('submenu is hidden');
        },
    };
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set([action]),
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
            data: '/submenu/what',
        },
    });
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
await test('menu-middleware action in non existing submenu updates main menu', async (t) => {
    const action = {
        trigger: /^\/submenu\/what$/,
        doFunction() {
            throw new Error('submenu is hidden');
        },
    };
    const submenuMenu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set([action]),
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
            data: '/foo/bar',
        },
    });
    strictEqual(answerCallbackQuery.mock.callCount(), 1);
    strictEqual(sendMenu.mock.callCount(), 1);
});
await test('menu-middleware action run took too long and updating menu afterwards tries to answerCallbackQuery and fails as being old but does not throw', async (t) => {
    const action = {
        trigger: /^\/what$/,
        doFunction: () => '.',
    };
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu, {
        async sendMenu() { },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    const answerCallbackQuery = t.mock.fn(async () => {
        throw new Error('Bad Request: query is too old and response timeout expired or query ID is invalid');
    });
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
});
await test('menu-middleware action updating menu still throws unknown error from answerCallbackQuery', async () => {
    const action = {
        trigger: /^\/what$/,
        doFunction: () => '.',
    };
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware('/', menu, {
        async sendMenu() { },
    });
    const bot = new Bot('123:ABC');
    bot.botInfo = {};
    bot.use(async (ctx, next) => {
        ctx.reply = () => {
            throw new Error('Use sendMenu instead');
        };
        ctx.answerCallbackQuery = async () => {
            throw new Error('Whatever went wrong here for the test');
        };
        return next();
    });
    bot.use(mm.middleware());
    bot.use(() => {
        throw new Error('dont call this function');
    });
    await rejects(async () => bot.handleUpdate({
        update_id: 666,
        callback_query: {
            id: '666',
            from: {},
            chat_instance: '666',
            data: '/what',
        },
    }), { message: /Whatever went wrong here for the test$/ });
});
//# sourceMappingURL=action.js.map