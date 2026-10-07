"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainedTemplateEngine = void 0;
const TemplateEngine_1 = require("./TemplateEngine");
/**
 * Calls the given array of {@link TemplateEngine}s in the order they appear,
 * feeding the output of one into the input of the next.
 *
 * The first engine will be called with the provided contents and template parameters.
 * All subsequent engines will be called with no template parameter.
 * Contents will still be passed along and another entry will be added for the body of the previous output.
 */
class ChainedTemplateEngine extends TemplateEngine_1.TemplateEngine {
    firstEngine;
    chainedEngines;
    renderedName;
    /**
     * @param engines - Engines will be executed in the same order as the array.
     * @param renderedName - The name of the key used to pass the body of one engine to the next.
     */
    constructor(engines, renderedName = 'body') {
        super();
        if (engines.length === 0) {
            throw new Error('At least 1 engine needs to be provided.');
        }
        this.firstEngine = engines[0];
        this.chainedEngines = engines.slice(1);
        this.renderedName = renderedName;
    }
    async canHandle(input) {
        return this.firstEngine.canHandle(input);
    }
    async handle({ contents, template }) {
        let body = await this.firstEngine.handle({ contents, template });
        for (const engine of this.chainedEngines) {
            body = await engine.handleSafe({ contents: { ...contents, [this.renderedName]: body } });
        }
        return body;
    }
}
exports.ChainedTemplateEngine = ChainedTemplateEngine;
//# sourceMappingURL=ChainedTemplateEngine.js.map