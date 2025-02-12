import type { RegExpLike } from './generic-types.js';
export declare function ensureTriggerChild(trigger: string | RegExpLike): void;
export declare function ensureTriggerLastChild(trigger: string | RegExpLike): void;
export declare function combineTrigger(parent: RegExpLike, child: string | RegExpLike): RegExp;
export declare function createRootMenuTrigger(rootTrigger: string | RegExpLike): RegExpLike;
export declare function ensurePathMenu(path: string): void;
export declare function combinePath(parent: string, relativePath: string): string;
export declare function getMenuOfPath(path: string): string;
