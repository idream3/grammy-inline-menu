import type { ConstOrPromise, ContextFunc } from '../generic-types.js';
import type { BasicOptions } from './basic.js';
export type SetPageFunction<Context> = (context: Context, page: number) => ConstOrPromise<void>;
export type GetCurrentPageFunction<Context> = ContextFunc<Context, number | undefined>;
export type GetTotalPagesFunction<Context> = ContextFunc<Context, number>;
export interface GenericPaginationOptions<Context> {
    /**
     * Function which is called when the user chooses a new page.
     * This is used to store the user selection.
     *
     * @example
     * setPage: (ctx, page) => {
     *   ctx.session.page = page
     * }
     */
    readonly setPage: SetPageFunction<Context>;
    /**
     * Function which returns the current page.
     * This is used to get the last user selection from your store.
     *
     * Defaults to page 1 when undefined or not a finite number.
     *
     * @example
     * getCurrentPage: ctx => ctx.session.page
     */
    readonly getCurrentPage: GetCurrentPageFunction<Context>;
}
export interface PaginationOptions<Context> extends BasicOptions<Context>, GenericPaginationOptions<Context> {
    /**
     * Returns the amount of pages which are available.
     *
     * @example
     * getTotalPages: ctx => amountOfElements / ITEMS_PER_PAGE
     */
    readonly getTotalPages: GetTotalPagesFunction<Context>;
}
/**
 * Creates Choices for the paginator
 * @param  totalPages  total amount of pages. Array.length is a good way to return this one.
 * @param  currentPage current page. Has to be between [1..totalPages]
 * @return returns the Choices
 */
export declare function createPaginationChoices(totalPages: number, currentPage: number | undefined): Record<number, string>;
