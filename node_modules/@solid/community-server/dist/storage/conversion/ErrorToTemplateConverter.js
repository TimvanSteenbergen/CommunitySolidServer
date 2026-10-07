"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorToTemplateConverter = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ContentTypes_1 = require("../../util/ContentTypes");
const HttpErrorUtil_1 = require("../../util/errors/HttpErrorUtil");
const PathUtil_1 = require("../../util/PathUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
const StringUtil_1 = require("../../util/StringUtil");
const BaseTypedRepresentationConverter_1 = require("./BaseTypedRepresentationConverter");
const DEFAULT_TEMPLATE_OPTIONS = {
    mainTemplatePath: (0, PathUtil_1.resolveModulePath)('templates/error/main.md.hbs'),
    codeTemplatesPath: (0, PathUtil_1.resolveModulePath)('templates/error/descriptions/'),
    extension: '.md.hbs',
    contentType: 'text/markdown',
};
/**
 * Serializes an Error by filling in the provided template.
 * Content-type is based on the constructor parameter.
 *
 * In case the input Error has an `errorCode` value,
 * the converter will look in the `descriptions` for a file
 * with the exact same name as that error code + `extension`.
 * The templating engine will then be applied to that file.
 * That result will be passed as an additional parameter to the main templating call,
 * using the variable `codeMessage`.
 */
class ErrorToTemplateConverter extends BaseTypedRepresentationConverter_1.BaseTypedRepresentationConverter {
    templateEngine;
    mainTemplatePath;
    codeTemplatesPath;
    extension;
    contentType;
    constructor(templateEngine, templateOptions) {
        super(ContentTypes_1.INTERNAL_ERROR, templateOptions?.contentType ?? DEFAULT_TEMPLATE_OPTIONS.contentType);
        // Workaround for https://github.com/LinkedSoftwareDependencies/Components.js/issues/20
        if (!templateOptions || Object.keys(templateOptions).length === 0) {
            templateOptions = DEFAULT_TEMPLATE_OPTIONS;
        }
        this.templateEngine = templateEngine;
        this.mainTemplatePath = templateOptions.mainTemplatePath;
        this.codeTemplatesPath = templateOptions.codeTemplatesPath;
        this.extension = templateOptions.extension;
        this.contentType = templateOptions.contentType;
    }
    async handle({ representation }) {
        const error = await (0, StreamUtil_1.getSingleItem)(representation.data);
        // Render the error description using an error-specific template
        let description;
        try {
            const templateFile = `${error.errorCode}${this.extension}`;
            (0, node_assert_1.default)((0, StringUtil_1.isValidFileName)(templateFile), 'Invalid error template name');
            // Filter out the error terms to pass to the template
            description = await this.templateEngine.handleSafe({
                contents: (0, HttpErrorUtil_1.extractErrorTerms)(error.metadata),
                template: { templateFile, templatePath: this.codeTemplatesPath },
            });
        }
        catch {
            // In case no template is found, or rendering errors, we still want to convert
        }
        // Render the main template, embedding the rendered error description
        const { name, message, stack, cause } = error;
        const contents = { name, message, stack, description, cause };
        const rendered = await this.templateEngine
            .handleSafe({ contents, template: { templateFile: this.mainTemplatePath } });
        return new BasicRepresentation_1.BasicRepresentation(rendered, representation.metadata, this.contentType);
    }
}
exports.ErrorToTemplateConverter = ErrorToTemplateConverter;
//# sourceMappingURL=ErrorToTemplateConverter.js.map