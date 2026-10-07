import type { ShorthandExtractor } from './extractors/ShorthandExtractor';
import { ShorthandResolver } from './ShorthandResolver';
/**
 * Generates variable values by running a set of {@link ShorthandExtractor}s on the input.
 */
export declare class CombinedShorthandResolver extends ShorthandResolver {
    readonly resolvers: Record<string, ShorthandExtractor>;
    constructor(resolvers: Record<string, ShorthandExtractor>);
    handle(input: Record<string, unknown>): Promise<Record<string, unknown>>;
}
