import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { MenuTemplate } from '../../source/menu-template.js';
await test('menu-template empty-menu has no buttons', async () => {
    const menu = new MenuTemplate('whatever');
    const keyboard = await menu.renderKeyboard(undefined, '/');
    deepStrictEqual(keyboard, []);
});
await test('menu-template empty-menu has no actions', () => {
    const menu = new MenuTemplate('whatever');
    const actions = menu.renderActionHandlers(/^\//);
    deepStrictEqual(actions, new Set());
});
await test('menu-template empty-menu has no submenus', () => {
    const menu = new MenuTemplate('whatever');
    const submenus = menu.listSubmenus();
    deepStrictEqual(submenus, new Set());
});
//# sourceMappingURL=empty-menu.js.map