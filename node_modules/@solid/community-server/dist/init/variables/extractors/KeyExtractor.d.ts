import type { Shorthand } from '../Types';
import { ShorthandExtractor } from './ShorthandExtractor';
/**
 * A simple {@link ShorthandExtractor} that extracts a single value from the input map.
 * Returns the default value if it was defined in case no value was found in the map.
 */
export declare class KeyExtractor extends ShorthandExtractor {
    private readonly key;
    private readonly defaultValue;
    constructor(key: string, defaultValue?: unknown);
    handle(args: Shorthand): Promise<unknown>;
}
