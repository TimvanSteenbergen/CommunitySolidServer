"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewInteractionHandler = void 0;
const MethodNotAllowedHttpError_1 = require("../../util/errors/MethodNotAllowedHttpError");
const JsonInteractionHandler_1 = require("./JsonInteractionHandler");
/**
 * Utility class for the common case of a {@link JsonInteractionHandler}
 * describing the expected input on a GET request which is needed to do a POST request.
 *
 * Returns the result of a {@link JsonView} on GET requests.
 * POST requests are sent to the {@link JsonInteractionHandler}.
 * Other methods will be rejected.
 */
class ViewInteractionHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    source;
    constructor(source) {
        super();
        this.source = source;
    }
    async canHandle(input) {
        const { method } = input;
        if (method !== 'GET' && method !== 'POST') {
            throw new MethodNotAllowedHttpError_1.MethodNotAllowedHttpError([method], 'Only GET/POST requests are supported.');
        }
        if (method === 'POST') {
            await this.source.canHandle(input);
        }
    }
    async handle(input) {
        if (input.method === 'GET') {
            return this.source.getView(input);
        }
        return this.source.handle(input);
    }
}
exports.ViewInteractionHandler = ViewInteractionHandler;
//# sourceMappingURL=ViewInteractionHandler.js.map