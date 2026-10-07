"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlViewHandler = exports.HtmlViewEntry = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const ConversionUtil_1 = require("../../storage/conversion/ConversionUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const MethodNotAllowedHttpError_1 = require("../../util/errors/MethodNotAllowedHttpError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const InteractionHandler_1 = require("./InteractionHandler");
/**
 * Used to link file paths and URLs together.
 * The reason we use a separate object instead of a key/value Record,
 * is that this makes it easier to override the values in Components.js,
 * which can be useful if someone wants to replace the HTML for certain URLs.
 */
class HtmlViewEntry {
    route;
    filePath;
    constructor(route, filePath) {
        this.route = route;
        this.filePath = filePath;
    }
}
exports.HtmlViewEntry = HtmlViewEntry;
/**
 * Stores the HTML templates associated with specific InteractionRoutes.
 *
 * This class will only handle GET operations for which there is a matching template,
 * if HTML is more preferred than JSON.
 * The reason for doing it like this instead of a standard content negotiation flow,
 * is because we only want to return the HTML pages on GET requests.
 *
 * Templates will receive the parameter `idpIndex` in their context pointing to the root index URL of the IDP API
 * and an `authenticating` parameter indicating if this is an active OIDC interaction.
 */
class HtmlViewHandler extends InteractionHandler_1.InteractionHandler {
    idpIndex;
    templateEngine;
    templates;
    constructor(index, templateEngine, templates) {
        super();
        this.idpIndex = index.getPath();
        this.templateEngine = templateEngine;
        this.templates = templates;
    }
    async canHandle({ operation }) {
        if (operation.method !== 'GET') {
            throw new MethodNotAllowedHttpError_1.MethodNotAllowedHttpError([operation.method]);
        }
        const preferences = (0, ConversionUtil_1.cleanPreferences)(operation.preferences.type);
        const htmlWeight = (0, ConversionUtil_1.getTypeWeight)(ContentTypes_1.TEXT_HTML, preferences);
        const jsonWeight = (0, ConversionUtil_1.getTypeWeight)(ContentTypes_1.APPLICATION_JSON, preferences);
        if (jsonWeight >= htmlWeight) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('HTML views are only returned when they are preferred.');
        }
        // Will throw error if no match is found
        this.findTemplate(operation.target.path);
    }
    async handle({ operation, oidcInteraction }) {
        const template = this.findTemplate(operation.target.path);
        const contents = { idpIndex: this.idpIndex, authenticating: Boolean(oidcInteraction) };
        const result = await this.templateEngine.handleSafe({ contents, template: { templateFile: template } });
        return new BasicRepresentation_1.BasicRepresentation(result, operation.target, ContentTypes_1.TEXT_HTML);
    }
    /**
     * Finds the template for the given URL.
     */
    findTemplate(target) {
        for (const template of this.templates) {
            if (template.route.matchPath(target)) {
                return template.filePath;
            }
        }
        throw new NotFoundHttpError_1.NotFoundHttpError();
    }
}
exports.HtmlViewHandler = HtmlViewHandler;
//# sourceMappingURL=HtmlViewHandler.js.map