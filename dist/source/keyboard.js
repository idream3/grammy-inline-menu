import { Buffer } from 'node:buffer';
import { filterNonNullable, } from './generic-types.js';
import { combinePath } from './path.js';
function isRow(entry) {
    return Array.isArray(entry);
}
function isCallbackButtonTemplate(kindOfButton) {
    return 'text' in kindOfButton && 'relativePath' in kindOfButton;
}
export class Keyboard {
    #entries = [];
    addCreator(creator) {
        this.#entries.push(creator);
    }
    add(joinLastRow, ...buttons) {
        const lastEntry = this.#entries.at(-1);
        if (joinLastRow && isRow(lastEntry)) {
            lastEntry.push(...buttons);
            return;
        }
        this.#entries.push([...buttons]);
    }
    async render(context, path) {
        const arrayOfRowArrays = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
        this.#entries.map(async (o) => entryToRows(o, context, path)));
        const rows = arrayOfRowArrays
            .flat(1)
            .map(row => renderRow(row, path))
            .filter(o => o.length > 0);
        return rows;
    }
}
async function entryToRows(entry, context, path) {
    if (typeof entry === 'function') {
        return entry(context, path);
    }
    const buttonsInRow = await Promise.all(entry.map(async (button) => typeof button === 'function' ? button(context, path) : button));
    const filtered = buttonsInRow.filter(filterNonNullable());
    return [filtered];
}
function renderRow(templates, path) {
    return templates.map(template => isCallbackButtonTemplate(template)
        ? renderCallbackButtonTemplate(template, path)
        : template);
}
function renderCallbackButtonTemplate(template, path) {
    const absolutePath = combinePath(path, template.relativePath);
    const absolutePathLength = Buffer.byteLength(absolutePath, 'utf8');
    if (absolutePathLength > 64) {
        throw new Error(`callback_data only supports 1-64 bytes. With this button (${template.relativePath}) it would get too long (${absolutePathLength}). Full path: ${absolutePath}`);
    }
    return {
        text: template.text,
        callback_data: absolutePath,
    };
}
//# sourceMappingURL=keyboard.js.map