import type { InteractionRoute } from './InteractionRoute';
/**
 * A route that is relative to another route.
 * The relative path will be joined to the input base,
 * which can either be an absolute URL or an InteractionRoute of which the path will be used.
 */
export declare class RelativePathInteractionRoute<TBase extends string> implements InteractionRoute<TBase> {
    private readonly base;
    private readonly relativePath;
    constructor(base: InteractionRoute<TBase>, relativePath: string, ensureSlash?: boolean);
    getPath(parameters?: Record<TBase, string>): string;
    matchPath(path: string): Record<TBase, string> | undefined;
}
