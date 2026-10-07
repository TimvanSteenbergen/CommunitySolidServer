"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyErrorHandler = void 0;
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const Vocabularies_1 = require("../../../util/Vocabularies");
const ResponseDescription_1 = require("../response/ResponseDescription");
const ErrorHandler_1 = require("./ErrorHandler");
/**
 * An {@link ErrorHandler} that returns an error response without adding a body.
 * For certain status codes, such as 304, it is important to not change anything
 * in the headers, such as content-type.
 *
 * The `statusCodes` array contains the status codes of error types for which
 * a body should never be added.
 *
 * The `always` boolean can be set to `true` to indicate that all errors should
 * be handled here.
 *
 * For errors with different status codes, a metadata field can be added
 * to indicate that this specific error response should not receive a body.
 * The predicate should be `urn:npm:solid:community-server:error:emptyBody`
 * and the value `true`.
 */
class EmptyErrorHandler extends ErrorHandler_1.ErrorHandler {
    statusCodes;
    always;
    constructor(statusCodes = [304], always = false) {
        super();
        this.statusCodes = statusCodes;
        this.always = always;
    }
    async canHandle({ error }) {
        if (this.always || this.statusCodes.includes(error.statusCode) ||
            error.metadata.get(Vocabularies_1.SOLID_ERROR.terms.emptyBody)?.value === 'true') {
            return;
        }
        throw new NotImplementedHttpError_1.NotImplementedHttpError();
    }
    async handle({ error }) {
        return new ResponseDescription_1.ResponseDescription(error.statusCode, error.metadata);
    }
}
exports.EmptyErrorHandler = EmptyErrorHandler;
//# sourceMappingURL=EmptyErrorHandler.js.map