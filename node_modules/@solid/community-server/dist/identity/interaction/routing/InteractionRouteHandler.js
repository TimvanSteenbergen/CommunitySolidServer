"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionRouteHandler = void 0;
const NotFoundHttpError_1 = require("../../../util/errors/NotFoundHttpError");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * InteractionHandler that only accepts input of which the target matches the stored route.
 *
 * Rejects operations that target a different route,
 * otherwise the input parameters are passed to the source handler.
 */
class InteractionRouteHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    route;
    source;
    constructor(route, source) {
        super();
        this.route = route;
        this.source = source;
    }
    async canHandle(input) {
        const { target } = input;
        if (!this.route.matchPath(target.path)) {
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        await this.source.canHandle(input);
    }
    async handle(input) {
        return this.source.handle(input);
    }
}
exports.InteractionRouteHandler = InteractionRouteHandler;
//# sourceMappingURL=InteractionRouteHandler.js.map