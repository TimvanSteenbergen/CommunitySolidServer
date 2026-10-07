import type { Shorthand } from '../Types';
import { ShorthandExtractor } from './ShorthandExtractor';
/**
 * A {@link ShorthandExtractor} that converts a path value to an absolute asset path
 * by making use of `resolveAssetPath`.
 * Returns the default path in case it is defined and no path was found in the map.
 */
export declare class AssetPathExtractor extends ShorthandExtractor {
    private readonly key;
    private readonly defaultPath?;
    constructor(key: string, defaultPath?: string);
    handle(args: Shorthand): Promise<unknown>;
}
