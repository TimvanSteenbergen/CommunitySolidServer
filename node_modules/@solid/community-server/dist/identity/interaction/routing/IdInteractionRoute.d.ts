import type { InteractionRoute } from './InteractionRoute';
/**
 * An {@link InteractionRoute} for routes that have a dynamic identifier in their path.
 */
export declare class IdInteractionRoute<TBase extends string, TId extends string> implements InteractionRoute<TBase | TId> {
    private readonly base;
    private readonly idName;
    private readonly ensureSlash;
    private readonly matchRegex;
    constructor(base: InteractionRoute<TBase>, idName: TId, ensureSlash?: boolean);
    getPath(parameters?: Record<TBase | TId, string>): string;
    matchPath(path: string): Record<TBase | TId, string> | undefined;
}
