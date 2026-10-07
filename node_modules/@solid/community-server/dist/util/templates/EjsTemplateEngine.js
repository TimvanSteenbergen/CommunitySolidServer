"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EjsTemplateEngine = void 0;
const ejs_1 = require("ejs");
const ExtensionBasedTemplateEngine_1 = require("./ExtensionBasedTemplateEngine");
const TemplateUtil_1 = require("./TemplateUtil");
/**
 * Fills in EJS templates.
 */
class EjsTemplateEngine extends ExtensionBasedTemplateEngine_1.ExtensionBasedTemplateEngine {
    baseUrl;
    /**
     * @param baseUrl - Base URL of the server.
     * @param supportedExtensions - The extensions that are supported by this template engine (defaults to 'ejs').
     */
    constructor(baseUrl, supportedExtensions = ['ejs']) {
        super(supportedExtensions);
        this.baseUrl = baseUrl;
    }
    async handle({ contents, template }) {
        const options = { ...contents, filename: (0, TemplateUtil_1.getTemplateFilePath)(template), baseUrl: this.baseUrl };
        return (0, ejs_1.render)(await (0, TemplateUtil_1.readTemplate)(template), options);
    }
}
exports.EjsTemplateEngine = EjsTemplateEngine;
//# sourceMappingURL=EjsTemplateEngine.js.map