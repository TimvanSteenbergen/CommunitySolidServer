"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptHandler = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Redirects requests based on the OIDC Interaction prompt.
 * Errors in case no match was found.
 *
 * The reason we use this intermediate handler
 * instead of letting the OIDC library redirect directly to the correct page,
 * is because that library creates a cookie with of scope of the target page.
 * By having the library always redirect to the index page,
 * the cookie is relevant for all pages and other pages can see if we are still in an interaction.
 */
class PromptHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    promptRoutes;
    constructor(promptRoutes) {
        super();
        this.promptRoutes = promptRoutes;
    }
    async handle({ oidcInteraction }) {
        const prompt = oidcInteraction?.prompt.name;
        if (prompt && this.promptRoutes[prompt]) {
            const location = this.promptRoutes[prompt].getPath();
            this.logger.debug(`Current prompt is ${prompt} with URL ${location}`);
            // Not throwing redirect error since we also want to the prompt to the output json.
            return { json: { location, prompt } };
        }
        this.logger.warn(`Received unsupported prompt ${prompt}`);
        throw new BadRequestHttpError_1.BadRequestHttpError(`Unsupported prompt: ${prompt}`);
    }
}
exports.PromptHandler = PromptHandler;
//# sourceMappingURL=PromptHandler.js.map