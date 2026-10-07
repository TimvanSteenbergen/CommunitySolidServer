import type { Shorthand } from '../Types';
import { ShorthandExtractor } from './ShorthandExtractor';
/**
 * A {@link ShorthandExtractor} that that generates the base URL based on the input `baseUrl` value,
 * or by using the port if the first isn't provided.
 */
export declare class BaseUrlExtractor extends ShorthandExtractor {
    private readonly defaultPort;
    constructor(defaultPort?: number);
    handle(args: Shorthand): Promise<unknown>;
}
