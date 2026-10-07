"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionBasedTemplateEngine = void 0;
const NotImplementedHttpError_1 = require("../errors/NotImplementedHttpError");
const PathUtil_1 = require("../PathUtil");
const TemplateEngine_1 = require("./TemplateEngine");
const TemplateUtil_1 = require("./TemplateUtil");
/**
 * Parent class for template engines that accept handling based on whether the template extension is supported.
 */
class ExtensionBasedTemplateEngine extends TemplateEngine_1.TemplateEngine {
    supportedExtensions;
    /**
     * Constructor for ExtensionBasedTemplateEngine.
     *
     * @param supportedExtensions - Array of the extensions supported by the template engine (e.g. [ 'ejs' ]).
     */
    constructor(supportedExtensions) {
        super();
        this.supportedExtensions = supportedExtensions;
    }
    async canHandle({ template }) {
        if (typeof template === 'undefined') {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('No template was provided.');
        }
        // Check if the target template extension is supported.
        const filepath = (0, TemplateUtil_1.getTemplateFilePath)(template);
        if (typeof filepath === 'undefined' || !this.supportedExtensions.includes((0, PathUtil_1.getExtension)(filepath))) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('The provided template is not supported.');
        }
    }
}
exports.ExtensionBasedTemplateEngine = ExtensionBasedTemplateEngine;
//# sourceMappingURL=ExtensionBasedTemplateEngine.js.map