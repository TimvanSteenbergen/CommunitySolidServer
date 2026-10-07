"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizedRouteHandler = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const ForbiddenHttpError_1 = require("../../../util/errors/ForbiddenHttpError");
const UnauthorizedHttpError_1 = require("../../../util/errors/UnauthorizedHttpError");
const InteractionRouteHandler_1 = require("./InteractionRouteHandler");
/**
 * An {@link InteractionRouteHandler} specifically for an {@link AccountIdRoute}.
 * If there is no account ID, implying the user is not logged in,
 * an {@link UnauthorizedHttpError} will be thrown.
 * If there is an account ID, but it does not match the one in target resource,
 * a {@link ForbiddenHttpError} will be thrown.
 */
class AuthorizedRouteHandler extends InteractionRouteHandler_1.InteractionRouteHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(route, source) {
        super(route, source);
    }
    async handle(input) {
        const { target, accountId } = input;
        if (!accountId) {
            this.logger.warn(`Trying to access ${target.path} without authorization`);
            throw new UnauthorizedHttpError_1.UnauthorizedHttpError();
        }
        const match = this.route.matchPath(target.path);
        if (match.accountId !== accountId) {
            this.logger.warn(`Trying to access ${target.path} with wrong authorization: ${accountId}`);
            throw new ForbiddenHttpError_1.ForbiddenHttpError();
        }
        return this.source.handle(input);
    }
}
exports.AuthorizedRouteHandler = AuthorizedRouteHandler;
//# sourceMappingURL=AuthorizedRouteHandler.js.map