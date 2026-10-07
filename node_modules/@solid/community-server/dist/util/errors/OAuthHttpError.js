"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthHttpError = void 0;
const HttpError_1 = require("./HttpError");
/**
 * Represents on OAuth error that is being thrown.
 * OAuth error responses have additional fields that need to be present in the JSON response,
 * as described in RFC 6749, §4.1.2.1.
 */
class OAuthHttpError extends HttpError_1.HttpError {
    mandatoryFields;
    constructor(mandatoryFields, name, statusCode, message, options) {
        super(statusCode ?? 500, name ?? 'OAuthHttpError', message, options);
        this.mandatoryFields = mandatoryFields;
    }
    static isInstance(error) {
        return HttpError_1.HttpError.isInstance(error) && Boolean(error.mandatoryFields);
    }
}
exports.OAuthHttpError = OAuthHttpError;
//# sourceMappingURL=OAuthHttpError.js.map