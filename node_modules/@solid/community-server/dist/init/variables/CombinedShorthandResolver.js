"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinedShorthandResolver = void 0;
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const ShorthandResolver_1 = require("./ShorthandResolver");
/**
 * Generates variable values by running a set of {@link ShorthandExtractor}s on the input.
 */
class CombinedShorthandResolver extends ShorthandResolver_1.ShorthandResolver {
    resolvers;
    constructor(resolvers) {
        super();
        this.resolvers = resolvers;
    }
    async handle(input) {
        const vars = {};
        for (const [name, computer] of Object.entries(this.resolvers)) {
            try {
                vars[name] = await computer.handleSafe(input);
            }
            catch (err) {
                throw new Error(`Error in computing value for variable ${name}: ${(0, ErrorUtil_1.createErrorMessage)(err)}`);
            }
        }
        return vars;
    }
}
exports.CombinedShorthandResolver = CombinedShorthandResolver;
//# sourceMappingURL=CombinedShorthandResolver.js.map