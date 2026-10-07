"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterHandler = void 0;
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const BaseRouterHandler_1 = require("./BaseRouterHandler");
/**
 * A {@link BaseRouterHandler} for an {@link HttpHandler}.
 * Uses a {@link TargetExtractor} to generate the target identifier.
 */
class RouterHandler extends BaseRouterHandler_1.BaseRouterHandler {
    targetExtractor;
    constructor(args) {
        super(args);
        this.targetExtractor = args.targetExtractor;
    }
    async canHandle(input) {
        const { request } = input;
        if (!request.url) {
            throw new BadRequestHttpError_1.BadRequestHttpError('Cannot handle request without a url');
        }
        const target = await this.targetExtractor.handleSafe({ request });
        await super.canHandleInput(input, request.method ?? 'UNKNOWN', target);
    }
}
exports.RouterHandler = RouterHandler;
//# sourceMappingURL=RouterHandler.js.map