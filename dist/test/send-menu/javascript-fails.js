import { rejects } from 'node:assert';
import { test } from 'node:test';
import { MenuTemplate } from '../../source/index.js';
import { editMenuOnContext, generateEditMessageIntoMenuFunction, generateSendMenuToChatFunction, replyMenuToContext, } from '../../source/send-menu.js';
const EXPECTED_ERROR = {
    message: /The body has to be a string or an object containing text or media/,
};
const FAULTY_MENU_TEMPLATES = {
    // @ts-expect-error
    'empty body object': new MenuTemplate({}),
    'empty string body': new MenuTemplate(''),
    // @ts-expect-error
    'wrong media type': new MenuTemplate({ media: 'bla', type: 'banana' }),
    'text in location body': new MenuTemplate({
        location: { latitude: 53.5, longitude: 10 },
        text: '42',
    }),
    'text in venue body': new MenuTemplate({
        venue: {
            location: { latitude: 53.5, longitude: 10 },
            title: 'A',
            address: 'B',
        },
        text: '42',
    }),
    'missing address in venue body': new MenuTemplate({
        // @ts-expect-error
        venue: { location: { latitude: 53.5, longitude: 10 }, title: 'A' },
    }),
    'missing title in venue body': new MenuTemplate({
        // @ts-expect-error
        venue: { location: { latitude: 53.5, longitude: 10 }, address: 'B' },
    }),
};
await test('send-menu javascript-fails context edit', async (t) => {
    await Promise.all(Object.entries(FAULTY_MENU_TEMPLATES).map(async ([fault, menu]) => t.test(fault, async () => {
        const fakeContext = {
            callbackQuery: {
                id: '666',
                chat_instance: '666',
                from: {},
                data: '666',
                message: {
                    text: '42',
                    date: 666,
                    message_id: 666,
                    chat: {},
                },
            },
        };
        await rejects(async () => editMenuOnContext(menu, fakeContext, '/'), EXPECTED_ERROR);
    })));
});
await test('send-menu javascript-fails context reply', async (t) => {
    await Promise.all(Object.entries(FAULTY_MENU_TEMPLATES).map(async ([fault, menu]) => t.test(fault, async () => {
        await rejects(async () => replyMenuToContext(menu, {}, '/'), EXPECTED_ERROR);
    })));
});
await test('send-menu javascript-fails telegram send', async (t) => {
    await Promise.all(Object.entries(FAULTY_MENU_TEMPLATES).map(async ([fault, menu]) => t.test(fault, async () => {
        const sendMenu = generateSendMenuToChatFunction({}, menu, '/');
        await rejects(async () => sendMenu(666, {}), EXPECTED_ERROR);
    })));
});
await test('send-menu javascript-fails telegram edit', async (t) => {
    await Promise.all(Object.entries(FAULTY_MENU_TEMPLATES).map(async ([fault, menu]) => t.test(fault, async () => {
        const editIntoMenu = generateEditMessageIntoMenuFunction({}, menu, '/');
        await rejects(async () => editIntoMenu(666, 666, {}), EXPECTED_ERROR);
    })));
});
//# sourceMappingURL=javascript-fails.js.map