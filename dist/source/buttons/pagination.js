import { clamp } from './align.js';
/**
 * Creates Choices for the paginator
 * @param  totalPages  total amount of pages. Array.length is a good way to return this one.
 * @param  currentPage current page. Has to be between [1..totalPages]
 * @return returns the Choices
 */
export function createPaginationChoices(totalPages, currentPage) {
    const buttons = {};
    const totalPagesFixed = Math.ceil(totalPages);
    if (!Number.isFinite(totalPagesFixed) || totalPagesFixed < 2) {
        return buttons;
    }
    const currentPageFixed = (typeof currentPage === 'number' && !Number.isNaN(currentPage))
        ? clamp(currentPage, 1, totalPagesFixed)
        : 1;
    const before = currentPageFixed - 1;
    if (currentPageFixed > 1) {
        if (before > 1) {
            buttons[1] = '1 ⏪';
        }
        buttons[before] = `${before} ◀️`;
    }
    buttons[currentPageFixed] = String(currentPageFixed);
    const after = currentPageFixed + 1;
    if (currentPageFixed < totalPagesFixed) {
        buttons[after] = `▶️ ${after}`;
        if (after < totalPagesFixed) {
            buttons[totalPagesFixed] = `⏩ ${totalPagesFixed}`;
        }
    }
    return buttons;
}
//# sourceMappingURL=pagination.js.map