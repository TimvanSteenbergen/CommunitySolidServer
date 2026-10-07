"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlebarsTemplateEngine = void 0;
const handlebars_1 = require("handlebars");
const ExtensionBasedTemplateEngine_1 = require("./ExtensionBasedTemplateEngine");
const TemplateUtil_1 = require("./TemplateUtil");
/**
 * Fills in Handlebars templates.
 */
class HandlebarsTemplateEngine extends ExtensionBasedTemplateEngine_1.ExtensionBasedTemplateEngine {
    baseUrl;
    /**
     * @param baseUrl - Base URL of the server.
     * @param supportedExtensions - The extensions that are supported by this template engine (defaults to 'hbs').
     */
    constructor(baseUrl, supportedExtensions = ['hbs']) {
        super(supportedExtensions);
        this.baseUrl = baseUrl;
    }
    async handle({ contents, template }) {
        const applyTemplate = (0, handlebars_1.compile)(await (0, TemplateUtil_1.readTemplate)(template));
        return applyTemplate({ ...contents, baseUrl: this.baseUrl });
    }
}
exports.HandlebarsTemplateEngine = HandlebarsTemplateEngine;
//# sourceMappingURL=HandlebarsTemplateEngine.js.map