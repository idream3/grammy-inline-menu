import { deepStrictEqual, strictEqual } from 'node:assert';
import { test } from 'node:test';
import { MEDIA_TYPES } from '../../source/body.js';
import { MenuTemplate } from '../../source/index.js';
import { replyMenuToContext } from '../../source/send-menu.js';
await test('context-reply media', async (t) => {
    await Promise.all(MEDIA_TYPES.map(async (mediaType) => t.test(mediaType, async (t) => {
        const menu = new MenuTemplate({
            media: 'whatever',
            type: mediaType,
        });
        const replyFunction = t.mock.fn(async (media, other) => {
            strictEqual(media, 'whatever');
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
            },
            replyWithAnimation: replyFunction,
            replyWithAudio: replyFunction,
            replyWithDocument: replyFunction,
            replyWithPhoto: replyFunction,
            replyWithVideo: replyFunction,
        };
        await replyMenuToContext(menu, fakeContext, '/');
        strictEqual(replyFunction.mock.callCount(), 1);
    })));
});
//# sourceMappingURL=context-reply.js.map