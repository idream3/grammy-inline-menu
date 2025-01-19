import { deepStrictEqual, rejects, strictEqual } from 'node:assert';
import { test } from 'node:test';
import { MenuMiddleware } from '../../source/menu-middleware.js';
await test('menu-middleware reply-to-context replies main menu', async (t) => {
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
    const mm = new MenuMiddleware('/', menu);
    const reply = t.mock.fn(async (text, other) => {
        strictEqual(text, 'whatever');
        deepStrictEqual(other, {
            disable_web_page_preview: false,
            entities: undefined,
            parse_mode: undefined,
            reply_markup: {
                inline_keyboard: [],
            },
        });
        return {};
    });
    const fakeContext = { reply };
    await mm.replyToContext(fakeContext);
    strictEqual(reply.mock.callCount(), 1);
});
await test('menu-middleware reply-to-context replies main menu explicitly', async (t) => {
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
    const mm = new MenuMiddleware('/', menu);
    const reply = t.mock.fn(async (text, other) => {
        strictEqual(text, 'whatever');
        deepStrictEqual(other, {
            disable_web_page_preview: false,
            entities: undefined,
            parse_mode: undefined,
            reply_markup: {
                inline_keyboard: [],
            },
        });
        return {};
    });
    const fakeContext = { reply };
    await mm.replyToContext(fakeContext, '/');
    strictEqual(reply.mock.callCount(), 1);
});
await test('menu-middleware reply-to-context replies submenu', async (t) => {
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
    const mm = new MenuMiddleware('/', menu);
    const reply = t.mock.fn(async (text, other) => {
        strictEqual(text, 'submenu');
        deepStrictEqual(other, {
            disable_web_page_preview: false,
            entities: undefined,
            parse_mode: undefined,
            reply_markup: {
                inline_keyboard: [],
            },
        });
        return {};
    });
    const fakeContext = { reply };
    await mm.replyToContext(fakeContext, '/submenu/');
    strictEqual(reply.mock.callCount(), 1);
});
await test('menu-middleware reply-to-context fails with out of scope path', async () => {
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
    const mm = new MenuMiddleware('/', menu);
    await rejects(async () => mm.replyToContext({}, 'foo/'), {
        message: 'There is no menu which works with your supplied path: foo/',
    });
});
await test('menu-middleware reply-to-context fails when rootTrigger is a regex and path is not explicit', async () => {
    const menu = {
        listSubmenus: () => new Set(),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const mm = new MenuMiddleware(/^tree(\d+)\//, menu);
    await rejects(async () => {
        await mm.replyToContext({});
    }, { message: /absolute path explicitly as a string/ });
});
//# sourceMappingURL=reply-to-context.js.map