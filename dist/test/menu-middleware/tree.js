import { strictEqual } from 'node:assert';
import { test } from 'node:test';
import { MenuMiddleware } from '../../source/menu-middleware.js';
const EMPTY_MENU = {
    listSubmenus: () => new Set(),
    renderActionHandlers: () => new Set(),
    renderBody: () => 'whatever',
    renderKeyboard: () => [],
};
await test('menu-middleware tree empty', () => {
    const tree = new MenuMiddleware('/', EMPTY_MENU).tree();
    const expected = `Menu Tree
menu                          /
`;
    strictEqual(tree, expected);
});
await test('menu-middleware tree action', () => {
    const action = {
        trigger: /^\/what$/,
        doFunction() {
            throw new Error('dont call me');
        },
    };
    const menu = {
        listSubmenus: () => new Set([]),
        renderActionHandlers: () => new Set([action]),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const tree = new MenuMiddleware('/', menu).tree();
    const expected = `Menu Tree
menu                          /
  action                      /what
`;
    strictEqual(tree, expected);
});
await test('menu-middleware tree submenu', () => {
    const submenu = {
        trigger: /submenu\//,
        hide: () => false,
        menu: EMPTY_MENU,
    };
    const menu = {
        listSubmenus: () => new Set([submenu]),
        renderActionHandlers: () => new Set(),
        renderBody: () => 'whatever',
        renderKeyboard: () => [],
    };
    const tree = new MenuMiddleware('/', menu).tree();
    const expected = `Menu Tree
menu                          /
  menu                        /submenu/
`;
    strictEqual(tree, expected);
});
await test('menu-middleware tree subsubmenu', () => {
    const subsubmenu = {
        trigger: /deep\//,
        hide: () => false,
        menu: EMPTY_MENU,
    };
    const submenuMenu = {
        listSubmenus: () => new Set([subsubmenu]),
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
    const tree = new MenuMiddleware('/', menu).tree();
    const expected = `Menu Tree
menu                          /
  menu                        /submenu/
    menu                      /submenu/deep/
`;
    strictEqual(tree, expected);
});
await test('menu-middleware tree action in submenu', () => {
    const action = {
        trigger: /^\/submenu\/what$/,
        doFunction() {
            throw new Error('dont call me');
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
    const tree = new MenuMiddleware('/', menu).tree();
    const expected = `Menu Tree
menu                          /
  menu                        /submenu/
    action                    /submenu/what
`;
    strictEqual(tree, expected);
});
//# sourceMappingURL=tree.js.map