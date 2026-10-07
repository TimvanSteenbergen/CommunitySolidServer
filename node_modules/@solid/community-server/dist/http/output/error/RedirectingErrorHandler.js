"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectingErrorHandler = void 0;
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const RedirectHttpError_1 = require("../../../util/errors/RedirectHttpError");
const RedirectResponseDescription_1 = require("../response/RedirectResponseDescription");
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * Internally we create redirects by throwing specific {@link RedirectHttpError}s.
 * This Error handler converts those to {@link RedirectResponseDescription}s that are used for output.
 */
class RedirectingErrorHandler extends ErrorHandler_1.ErrorHandler {
    async canHandle({ error }) {
        if (!RedirectHttpError_1.RedirectHttpError.isInstance(error)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only redirect errors are supported.');
        }
    }
    async handle({ error }) {
        // Cast verified by canHandle
        return new RedirectResponseDescription_1.RedirectResponseDescription(error);
    }
}
exports.RedirectingErrorHandler = RedirectingErrorHandler;
//# sourceMappingURL=RedirectingErrorHandler.js.map