import { deepStrictEqual, strictEqual } from 'node:assert';
import { test } from 'node:test';
import { MEDIA_TYPES } from '../../source/body.js';
import { MenuTemplate } from '../../source/index.js';
import { generateSendMenuToChatFunction } from '../../source/send-menu.js';
await test('telegram-send text', async () => {
    const menu = new MenuTemplate('whatever');
    const fakeTelegram = {
        async sendMessage(chatId, text, other) {
            strictEqual(chatId, 666);
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
        },
    };
    const sendMenu = generateSendMenuToChatFunction(fakeTelegram, menu, '/');
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
        },
    };
    await sendMenu(666, fakeContext);
});
await test('telegram-send media', async (t) => {
    await Promise.all(MEDIA_TYPES.map(async (mediaType) => t.test(mediaType, async () => {
        const menu = new MenuTemplate({
            media: 'whatever',
            type: mediaType,
        });
        const sendFunction = async (chatId, media, other) => {
            strictEqual(chatId, 666);
            strictEqual(media, 'whatever');
            deepStrictEqual(other, {
                caption: undefined,
                caption_entities: undefined,
                parse_mode: undefined,
                reply_markup: {
                    inline_keyboard: [],
                },
            });
            return {};
        };
        const fakeTelegram = {
            sendAnimation: sendFunction,
            sendAudio: sendFunction,
            sendDocument: sendFunction,
            sendPhoto: sendFunction,
            sendVideo: sendFunction,
        };
        const sendMenu = generateSendMenuToChatFunction(fakeTelegram, menu, '/');
        const fakeContext = {
            callbackQuery: {
                id: '666',
                from: undefined,
                chat_instance: '666',
                data: '666',
            },
        };
        await sendMenu(666, fakeContext);
    })));
});
await test('telegram-send location', async () => {
    const menu = new MenuTemplate({
        location: { latitude: 53.5, longitude: 10 },
        live_period: 666,
    });
    const fakeTelegram = {
        async sendLocation(chatId, latitude, longitude, other) {
            strictEqual(chatId, 666);
            strictEqual(latitude, 53.5);
            strictEqual(longitude, 10);
            deepStrictEqual(other, {
                live_period: 666,
                reply_markup: {
                    inline_keyboard: [],
                },
            });
            return {};
        },
    };
    const sendMenu = generateSendMenuToChatFunction(fakeTelegram, menu, '/');
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
        },
    };
    await sendMenu(666, fakeContext);
});
await test('telegram-send venue', async () => {
    const menu = new MenuTemplate({
        venue: {
            location: { latitude: 53.5, longitude: 10 },
            title: 'A',
            address: 'B',
        },
    });
    const fakeTelegram = {
        async sendVenue(chatId, latitude, longitude, title, address, other) {
            strictEqual(chatId, 666);
            strictEqual(latitude, 53.5);
            strictEqual(longitude, 10);
            strictEqual(title, 'A');
            strictEqual(address, 'B');
            deepStrictEqual(other, {
                foursquare_id: undefined,
                foursquare_type: undefined,
                reply_markup: {
                    inline_keyboard: [],
                },
            });
            return {};
        },
    };
    const sendMenu = generateSendMenuToChatFunction(fakeTelegram, menu, '/');
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
        },
    };
    await sendMenu(666, fakeContext);
});
await test('telegram-send invoice', async () => {
    const menu = new MenuTemplate({
        invoice: {
            title: 'A',
            description: 'B',
            currency: 'EUR',
            payload: 'D',
            prices: [],
        },
    });
    const fakeTelegram = {
        async sendInvoice(chatId, title, description, payload, currency, prices, other) {
            strictEqual(chatId, 666);
            strictEqual(title, 'A');
            strictEqual(description, 'B');
            strictEqual(currency, 'EUR');
            strictEqual(payload, 'D');
            deepStrictEqual(prices, []);
            deepStrictEqual(other, {
                reply_markup: {
                    inline_keyboard: [],
                },
            });
            return {};
        },
    };
    const sendMenu = generateSendMenuToChatFunction(fakeTelegram, menu, '/');
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
        },
    };
    await sendMenu(666, fakeContext);
});
await test('telegram-send text with entities', async () => {
    const menu = new MenuTemplate({
        text: 'Hello world!',
        entities: [
            {
                type: 'bold',
                offset: 0,
                length: 5,
            },
            {
                type: 'italic',
                offset: 6,
                length: 5,
            },
        ],
    });
    const fakeTelegram = {
        async sendMessage(chatId, text, other) {
            strictEqual(chatId, 666);
            strictEqual(text, 'Hello world!');
            deepStrictEqual(other, {
                disable_web_page_preview: undefined,
                entities: [
                    {
                        type: 'bold',
                        offset: 0,
                        length: 5,
                    },
                    {
                        type: 'italic',
                        offset: 6,
                        length: 5,
                    },
                ],
                parse_mode: undefined,
                reply_markup: {
                    inline_keyboard: [],
                },
            });
            return {};
        },
    };
    const sendMenu = generateSendMenuToChatFunction(fakeTelegram, menu, '/');
    const fakeContext = {
        callbackQuery: {
            id: '666',
            from: undefined,
            chat_instance: '666',
            data: '666',
        },
    };
    await sendMenu(666, fakeContext);
});
//# sourceMappingURL=telegram-send.js.map