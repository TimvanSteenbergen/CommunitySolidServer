import type { CliExtractor } from './cli/CliExtractor';
import type { ShorthandResolver } from './variables/ShorthandResolver';
/**
 * A class that combines a {@link CliExtractor} and a {@link ShorthandResolver}.
 * Mainly exists so both such classes can be generated in a single Components.js instance.
 */
export declare class CliResolver {
    readonly cliExtractor: CliExtractor;
    readonly shorthandResolver: ShorthandResolver;
    constructor(cliExtractor: CliExtractor, shorthandResolver: ShorthandResolver);
}
