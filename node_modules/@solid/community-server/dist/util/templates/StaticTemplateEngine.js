"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticTemplateEngine = void 0;
const TemplateEngine_1 = require("./TemplateEngine");
/**
 * Template engine that renders output based on a static template file.
 */
class StaticTemplateEngine extends TemplateEngine_1.TemplateEngine {
    template;
    templateEngine;
    /**
     * Creates a new StaticTemplateEngine.
     *
     * @param templateEngine - The template engine that should be used for processing the template.
     * @param template - The static template to be used.
     */
    constructor(templateEngine, template) {
        super();
        this.template = template;
        this.templateEngine = templateEngine;
    }
    async canHandle({ contents, template }) {
        if (typeof template !== 'undefined') {
            throw new TypeError('StaticTemplateEngine does not support template as handle input, ' +
                'provide a template via the constructor instead!');
        }
        return this.templateEngine.canHandle({ contents, template: this.template });
    }
    async handle({ contents }) {
        return this.templateEngine.handle({ contents, template: this.template });
    }
}
exports.StaticTemplateEngine = StaticTemplateEngine;
//# sourceMappingURL=StaticTemplateEngine.js.map