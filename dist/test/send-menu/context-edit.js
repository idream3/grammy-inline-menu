// This test file also tests replyMenuToContext indirectly as its the edit fallback
import { deepStrictEqual, rejects, strictEqual } from 'node:assert';
import { test } from 'node:test';
import { MenuTemplate } from '../../source/index.js';
import { editMenuOnContext } from '../../source/send-menu.js';
await test('context-edit text reply when not a callback query', async (t) => {
    const menu = new MenuTemplate('whatever');
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
    const fakeContext = {
        callbackQuery: undefined,
        reply,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(reply.mock.callCount(), 1);
});
await test('context-edit text reply when no message on callback query', async (t) => {
    const menu = new MenuTemplate('whatever');
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
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
        },
        reply,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(reply.mock.callCount(), 1);
});
await test('context-edit text edit when message is a text message', async (t) => {
    const menu = new MenuTemplate('whatever');
    const editMessageText = t.mock.fn(async (text, other) => {
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
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        editMessageText,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(editMessageText.mock.callCount(), 1);
});
await test('context-edit text reply when message is a media message', async (t) => {
    const menu = new MenuTemplate('whatever');
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
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                photo: [],
            },
        },
        deleteMessage,
        reply,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(reply.mock.callCount(), 1);
});
await test('context-edit text reply when message is a media message but fails with delete', async (t) => {
    const menu = new MenuTemplate('whatever');
    const editMessage = t.mock.fn(async (markup) => {
        strictEqual(markup, undefined);
        return true;
    });
    const deleteMessage = t.mock.fn(async () => {
        throw new Error('whatever went wrong');
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
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                photo: [],
            },
        },
        deleteMessage,
        editMessageReplyMarkup: editMessage,
        reply,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(editMessage.mock.callCount(), 1);
    strictEqual(reply.mock.callCount(), 1);
});
await test('context-edit media reply when not a callback query', async (t) => {
    const menu = new MenuTemplate({
        media: 'whatever',
        type: 'photo',
    });
    const replyWithPhoto = t.mock.fn(async (photo, other) => {
        strictEqual(photo, 'whatever');
        deepStrictEqual(other, {
            caption: undefined,
            caption_entities: undefined,
            parse_mode: undefined,
            reply_markup: {
                inline_keyboard: [],
            },
        });
        return undefined;
    });
    const fakeContext = {
        callbackQuery: undefined,
        replyWithPhoto,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(replyWithPhoto.mock.callCount(), 1);
});
await test('context-edit media reply when location message', async (t) => {
    const menu = new MenuTemplate({
        media: 'whatever',
        type: 'photo',
    });
    const deleteMessage = t.mock.fn(async (messageId) => {
        strictEqual(messageId, undefined);
        return true;
    });
    const replyWithPhoto = t.mock.fn(async (photo, other) => {
        strictEqual(photo, 'whatever');
        deepStrictEqual(other, {
            caption: undefined,
            caption_entities: undefined,
            parse_mode: undefined,
            reply_markup: {
                inline_keyboard: [],
            },
        });
        return undefined;
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                location: {
                    latitude: 13,
                    longitude: 37,
                },
            },
        },
        deleteMessage,
        replyWithPhoto,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(replyWithPhoto.mock.callCount(), 1);
});
await test('context-edit media edit when media message', async (t) => {
    const menu = new MenuTemplate({
        media: 'whatever',
        type: 'photo',
    });
    const editMessageMedia = t.mock.fn(async (media, other) => {
        deepStrictEqual(media, {
            media: 'whatever',
            type: 'photo',
            caption: undefined,
            parse_mode: undefined,
        });
        deepStrictEqual(other, {
            reply_markup: {
                inline_keyboard: [],
            },
        });
        return undefined;
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                photo: [],
            },
        },
        editMessageMedia,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(editMessageMedia.mock.callCount(), 1);
});
await test('context-edit media edit when text message', async (t) => {
    const menu = new MenuTemplate({
        media: 'whatever',
        type: 'photo',
    });
    const editMessageMedia = t.mock.fn(async (media, other) => {
        deepStrictEqual(media, {
            media: 'whatever',
            type: 'photo',
            caption: undefined,
            parse_mode: undefined,
        });
        deepStrictEqual(other, {
            reply_markup: {
                inline_keyboard: [],
            },
        });
        return undefined;
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'whatever',
            },
        },
        editMessageMedia,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(editMessageMedia.mock.callCount(), 1);
});
await test('context-edit does not throw message is not modified', async (t) => {
    const menu = new MenuTemplate('whatever');
    const editMessageText = t.mock.fn(async () => {
        throw new Error('lalala message is not modified lalala');
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        editMessageText,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(editMessageText.mock.callCount(), 1);
});
await test('context-edit does throw unrecoverable edit errors', async () => {
    const menu = new MenuTemplate('whatever');
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        async editMessageText() {
            throw new Error('something went wrong for testing');
        },
    };
    await rejects(async () => editMenuOnContext(menu, fakeContext, '/'), {
        message: 'something went wrong for testing',
    });
});
await test('context-edit text edit without webpage preview', async () => {
    const menu = new MenuTemplate({
        text: 'whatever',
        disable_web_page_preview: true,
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        async editMessageText(_text, other) {
            deepStrictEqual(other, {
                disable_web_page_preview: true,
                entities: undefined,
                parse_mode: undefined,
                reply_markup: {
                    inline_keyboard: [],
                },
            });
            return undefined;
        },
    };
    await editMenuOnContext(menu, fakeContext, '/');
});
await test('context-edit text edit with parse mode', async () => {
    const menu = new MenuTemplate({
        text: 'whatever',
        parse_mode: 'Markdown',
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        async editMessageText(_text, other) {
            deepStrictEqual(other, {
                disable_web_page_preview: undefined,
                entities: undefined,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [],
                },
            });
            return undefined;
        },
    };
    await editMenuOnContext(menu, fakeContext, '/');
});
await test('context-edit text edit with button', async () => {
    const menu = new MenuTemplate('whatever');
    menu.manual({ text: 'Button', callback_data: '/' });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        async editMessageText(_text, other) {
            deepStrictEqual(other?.reply_markup, {
                inline_keyboard: [[{
                            text: 'Button',
                            callback_data: '/',
                        }]],
            });
            return undefined;
        },
    };
    await editMenuOnContext(menu, fakeContext, '/');
});
await test('context-edit media edit with button', async () => {
    const menu = new MenuTemplate({
        media: 'whatever',
        type: 'photo',
    });
    menu.manual({ text: 'Button', callback_data: '/' });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                photo: [],
            },
        },
        async editMessageMedia(_media, other) {
            deepStrictEqual(other?.reply_markup, {
                inline_keyboard: [[{
                            text: 'Button',
                            callback_data: '/',
                        }]],
            });
            return undefined;
        },
    };
    await editMenuOnContext(menu, fakeContext, '/');
});
await test('context-edit location reply', async (t) => {
    const menu = new MenuTemplate({
        location: { latitude: 53.5, longitude: 10 },
        live_period: 666,
    });
    menu.manual({ text: 'Button', callback_data: '/' });
    const deleteMessage = t.mock.fn(async (messageId) => {
        strictEqual(messageId, undefined);
        return true;
    });
    const replyWithLocation = t.mock.fn(async (latitude, longitude, other) => {
        strictEqual(latitude, 53.5);
        strictEqual(longitude, 10);
        deepStrictEqual(other, {
            live_period: 666,
            reply_markup: {
                inline_keyboard: [[{ text: 'Button', callback_data: '/' }]],
            },
        });
        return undefined;
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        deleteMessage,
        replyWithLocation,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(replyWithLocation.mock.callCount(), 1);
});
await test('context-edit venue reply', async (t) => {
    const menu = new MenuTemplate({
        venue: {
            location: { latitude: 53.5, longitude: 10 },
            title: 'A',
            address: 'B',
        },
    });
    menu.manual({ text: 'Button', callback_data: '/' });
    const deleteMessage = t.mock.fn(async (messageId) => {
        strictEqual(messageId, undefined);
        return true;
    });
    const replyWithVenue = t.mock.fn(async (latitude, longitude, title, address, other) => {
        strictEqual(latitude, 53.5);
        strictEqual(longitude, 10);
        strictEqual(title, 'A');
        strictEqual(address, 'B');
        deepStrictEqual(other, {
            foursquare_id: undefined,
            foursquare_type: undefined,
            reply_markup: {
                inline_keyboard: [[{ text: 'Button', callback_data: '/' }]],
            },
        });
        return undefined;
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        deleteMessage,
        replyWithVenue,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(replyWithVenue.mock.callCount(), 1);
});
await test('context-edit invoice reply', async (t) => {
    const menu = new MenuTemplate({
        invoice: {
            title: 'A',
            description: 'B',
            currency: 'EUR',
            payload: 'D',
            prices: [],
        },
    });
    menu.manual({ text: 'Button', callback_data: '/' });
    const deleteMessage = t.mock.fn(async (messageId) => {
        strictEqual(messageId, undefined);
        return true;
    });
    const replyWithInvoice = t.mock.fn(async (title, description, payload, currency, prices, other) => {
        strictEqual(title, 'A');
        strictEqual(description, 'B');
        strictEqual(currency, 'EUR');
        strictEqual(payload, 'D');
        deepStrictEqual(prices, []);
        deepStrictEqual(other, {
            reply_markup: {
                inline_keyboard: [[{ text: 'Button', callback_data: '/' }]],
            },
        });
        return undefined;
    });
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
            message: {
                message_id: 666,
                date: 666,
                chat: undefined,
                text: 'Hi Bob',
            },
        },
        deleteMessage,
        replyWithInvoice,
    };
    await editMenuOnContext(menu, fakeContext, '/');
    strictEqual(deleteMessage.mock.callCount(), 1);
    strictEqual(replyWithInvoice.mock.callCount(), 1);
});
//# sourceMappingURL=context-edit.js.map