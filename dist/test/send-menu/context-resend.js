import { deepStrictEqual, strictEqual } from 'node:assert';
import { test } from 'node:test';
import { MenuTemplate } from '../../source/index.js';
import { resendMenuToContext } from '../../source/send-menu.js';
await test('context-resend on callback query', async (t) => {
    const deleteMessage = t.mock.fn(async (messageId) => {
        strictEqual(messageId, undefined);
        return true;
    });
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
        return undefined;
    });
    const menu = new MenuTemplate('whatever');
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
        },
        deleteMessage,
        reply,
    };
    await resendMenuToContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(reply.mock.callCount(), 1);
});
await test('context-resend on whatever', async (t) => {
    const deleteMessage = t.mock.fn(async (messageId) => {
        strictEqual(messageId, undefined);
        return true;
    });
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
        return undefined;
    });
    const menu = new MenuTemplate('whatever');
    const fakeContext = {
        deleteMessage,
        reply,
    };
    await resendMenuToContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(reply.mock.callCount(), 1);
});
//# sourceMappingURL=context-resend.js.map