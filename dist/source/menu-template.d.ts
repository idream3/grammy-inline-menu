import { type ActionFunc, type ButtonAction } from './action-hive.js';
import type { Body } from './body.js';
import type { CopyTextButtonOptions, InteractionOptions, ManualButtonOptions, SingleButtonOptions, SwitchToChatOptions, UrlButtonOptions } from './buttons/basic.js';
import type { ChooseOptions } from './buttons/choose.js';
import { type PaginationOptions } from './buttons/pagination.js';
import { type SelectOptions } from './buttons/select.js';
import type { ChooseIntoSubmenuOptions, SubmenuOptions } from './buttons/submenu.js';
import { type ToggleOptions } from './buttons/toggle.js';
import type { ConstOrContextPathFunc, ContextPathFunc, RegExpLike } from './generic-types.js';
import { type ButtonTemplate, type ButtonTemplateRow, type InlineKeyboard } from './keyboard.js';
import type { MenuLike, Submenu } from './menu-like.js';
export declare class MenuTemplate<Context> {
    #private;
    constructor(body: ConstOrContextPathFunc<Context, Body>);
    /**
     * Creates the message body. Usage only recommended for advanced usage of this library.
     * @param context Context to be supplied to the buttons on on creation
     */
    renderBody(context: Context, path: string): Promise<Body>;
    /**
     * Creates the raw keyboard information. Usage only recommended for advanced usage of this library.
     * @param context Context to be supplied to the buttons on on creation
     * @param path Path within the menu. Will be used for the relativePaths
     */
    renderKeyboard(context: Context, path: string): Promise<InlineKeyboard>;
    /**
     * Creates the actions that the buttons of the template want to happen. Usage only recommended for advanced usage of this library.
     * @param path Path within the menu. Will be used for the relativePaths
     */
    renderActionHandlers(path: RegExpLike): ReadonlySet<ButtonAction<Context>>;
    /** Lists the submenus used in this menu template. Usage only recommended for advanced usage of this library. */
    listSubmenus(): ReadonlySet<Submenu<Context>>;
    /**
     * Allows for manual creation of a button in a very raw way of doing. Less user friendly but very customizable.
     * @param button constant or function returning a button representation to be added to the keyboard
     */
    manual(button: ConstOrContextPathFunc<Context, ButtonTemplate>, options?: ManualButtonOptions<Context>): void;
    /**
     * Allows for manual creation of many buttons. Less user friendly but very customizable.
     * @param creator function generating a keyboard part
     */
    manualRow(creator: ContextPathFunc<Context, ButtonTemplateRow[]>): void;
    /**
     * Allows for manual creation of actions. Less user friendly but very customizable.
     * Is probably used together with manualRow.
     * @param trigger regular expression which is appended to the menu path.
     * @param action function which is called when the trigger is matched.
     * @example
     * menuTemplate.manualRow((context, path) => [[{text: 'Page 2', relativePath: 'custom-pagination:2'}, {text: 'Page 3', relativePath: 'custom-pagination:3'}]])
     * menuTemplate.manualAction(/custom-pagination:(\d+)$/, (context, path) => {
     *   console.log('manualAction', path, context.match![1])
     *   return '.'
     * })
     */
    manualAction(trigger: RegExpLike, action: ActionFunc<Context>): void;
    /** Add a copy_text button to the keyboard
     * @example
     * menuTemplate.copyText({
     *   text: 'Copy this',
     *   copy_text: { text: 'content' },
     * });
     */
    copyText(options: CopyTextButtonOptions<Context>): void;
    /** Add an url button to the keyboard
     * @example
     * menuTemplate.url({
     *   text: 'Homepage',
     *   url: 'https://edjopato.de/',
     * });
     */
    url(options: UrlButtonOptions<Context>): void;
    /** Add a switch_inline_query button to the keyboard
     * @example
     * menuTemplate.switchToChat({
     *   text: 'Use the inline mode',
     *   query: 'prefilled',
     * });
     */
    switchToChat(options: SwitchToChatOptions<Context>): void;
    /** Add a switch_inline_query_current_chat button to the keyboard
     * @example
     * menuTemplate.switchToCurrentChat({
     *   text: 'Try out the inline mode in this chat',
     *   query: 'prefilled',
     * });
     */
    switchToCurrentChat(options: SwitchToChatOptions<Context>): void;
    /**
     * Button which only purpose is to move around the menu on click.
     * The relative path is inspired by the cd command.
     * If you want to execute a function on click use `menuTemplate.interact(…)` instead.
     * @param relativePath relative target path like 'child/', '..' or '../sibling/
     * @example menuTemplate.navigate('..', {text: 'back to parent menu'})
     * @example menuTemplate.navigate('/', {text: 'to the root menu'})
     * @example menuTemplate.navigate('../sibling/', {text: 'to a sibling menu'})
     */
    navigate(relativePath: string, options: SingleButtonOptions<Context>): void;
    /**
     * Add a button to which a function is executed on click.
     * You can update the menu afterwards by returning a relative path. If you only want to update the menu or move around use `menuTemplate.navigate(…)` instead.
     * @param uniqueIdentifier unique identifier for this button within the menu template
     * @example
     * menuTemplate.interact('unique', {
     *   text: 'Knock Knock',
     *   do: async context => {
     *     await context.answerCallbackQuery('Who is there?')
     *     return false // Do not update the menu afterwards
     *   }
     * })
     * @example
     * menuTemplate.interact('unique', {
     *   text: 'Update the current menu afterwards',
     *   do: async context => {
     *     // do what you want to do
     *     return '.' // . like the current one -> this menu
     *   }
     * })
     */
    interact(uniqueIdentifier: string, options: InteractionOptions<Context>): void;
    /**
     * Add a button to a submenu
     * @param uniqueIdentifier unique identifier for this button within the menu template
     * @param submenu submenu to be entered on click
     * @example
     * const submenuTemplate = new MenuTemplate('I am a submenu')
     * submenuTemplate.interact('unique', {
     *   text: 'Text',
     *   do: async ctx => ctx.answerCallbackQuery('You hit a button in a submenu')
     * })
     * submenuTemplate.manualRow(createBackMainMenuButtons())
     *
     * menuTemplate.submenu('unique', submenuTemplate, { text: 'enter submenu' })
     */
    submenu(uniqueIdentifier: string, submenu: MenuLike<Context>, options: SubmenuOptions<Context>): void;
    /**
     * Let the user choose one of many options and execute a function for the one the user picked
     * @param uniqueIdentifierPrefix prefix which is used to create a unique identifier for each of the resulting buttons
     * @example
     * menuTemplate.choose('unique', {
     *   choices: ['walk', 'swim'],
     *   async do(ctx, key) {
     *     await ctx.answerCallbackQuery(`Lets ${key}`);
     *     return '..';
     *   }
     * });
     */
    choose(uniqueIdentifierPrefix: string, options: ChooseOptions<Context>): void;
    /**
     * Submenu which is entered when a user picks one of many choices
     * @param uniqueIdentifierPrefix prefix which is used to create a unique identifier for each of the resulting buttons
     * @param submenu submenu to be entered when one of the choices is picked
     * @example
     * const submenu = new MenuTemplate<MyContext>(ctx => `Welcome to ${ctx.match[1]}`)
     * submenu.interact('unique', {
     *   text: 'Text',
     *   do: async ctx => {
     *     console.log('Take a look at ctx.match. It contains the chosen city', ctx.match)
     *     await ctx.answerCallbackQuery('You hit a button in a submenu')
     *     return false
     *   }
     * })
     * submenu.manualRow(createBackMainMenuButtons())
     *
     * menu.chooseIntoSubmenu('unique', ['Gotham', 'Mos Eisley', 'Springfield'], submenu)
     */
    chooseIntoSubmenu(uniqueIdentifierPrefix: string, submenu: MenuLike<Context>, options: ChooseIntoSubmenuOptions<Context>): void;
    /**
     * Let the user select one (or multiple) options from a set of choices
     * @param uniqueIdentifierPrefix prefix which is used to create a unique identifier for each of the resulting buttons
     * @example
     * // User can select exactly one
     * menuTemplate.select('unique', {
     *   choices: ['at home', 'at work', 'somewhere else'],
     *   isSet: (context, key) => context.session.currentLocation === key,
     *   set: (context, key) => {
     *     context.session.currentLocation = key
     *     return true
     *   }
     * })
     * @example
     * // User can select one of multiple options
     * menuTemplate.select('unique', {
     *   showFalseEmoji: true,
     *   choices: ['has arms', 'has legs', 'has eyes', 'has wings'],
     *   isSet: (context, key) => Boolean(context.session.bodyparts[key]),
     *   set: (context, key, newState) => {
     *     context.session.bodyparts[key] = newState
     *     return true
     *   }
     * })
     */
    select(uniqueIdentifierPrefix: string, options: SelectOptions<Context>): void;
    /**
     * Shows a row of pagination buttons.
     * When the user presses one of the buttons `setPage` is called with the specified button.
     * In order to determine which is the current page and how many pages there are `getCurrentPage` and `getTotalPages` are called to which you have to return the current value
     * @param uniqueIdentifierPrefix prefix which is used to create a unique identifier for each of the resulting buttons
     */
    pagination(uniqueIdentifierPrefix: string, options: PaginationOptions<Context>): void;
    /**
     * Toogle a value when the button is pressed.
     * If you want to toggle multiple values use `menuTemplate.select(…)`
     * @param uniqueIdentifierPrefix unique identifier for this button within the menu template
     * @example
     * menuTemplate.toggle('unique', {
     *   text: 'Text',
     *   isSet: context => Boolean(context.session.isFunny),
     *   set: (context, newState) => {
     *     context.session.isFunny = newState
     *     return true
     *   }
     * })
     * @example
     * // You can use a custom format for the state instead of the default emoji
     * menuTemplate.toggle('unique', {
     *   text: 'Lamp',
     *   formatState: (context, text, state) => `${text}: ${state ? 'on' : 'off'}`,
     *   isSet: context => Boolean(context.session.lamp),
     *   set: (context, newState) => {
     *     context.session.lamp = newState
     *     return true
     *   }
     * })
     */
    toggle(uniqueIdentifierPrefix: string, options: ToggleOptions<Context>): void;
}
