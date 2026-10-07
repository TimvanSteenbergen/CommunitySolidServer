"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliResolver = void 0;
/**
 * A class that combines a {@link CliExtractor} and a {@link ShorthandResolver}.
 * Mainly exists so both such classes can be generated in a single Components.js instance.
 */
class CliResolver {
    cliExtractor;
    shorthandResolver;
    constructor(cliExtractor, shorthandResolver) {
        this.cliExtractor = cliExtractor;
        this.shorthandResolver = shorthandResolver;
    }
}
exports.CliResolver = CliResolver;
//# sourceMappingURL=CliResolver.js.map