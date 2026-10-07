"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotModifiedHttpError = void 0;
const Vocabularies_1 = require("../Vocabularies");
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(304, 'NotModifiedHttpError');
/**
 * An error is thrown when a request conflicts with the current state of the server.
 */
class NotModifiedHttpError extends BaseHttpError {
    constructor(eTag, message, options) {
        super(message, options);
        this.metadata.set(Vocabularies_1.HH.terms.etag, eTag);
    }
}
exports.NotModifiedHttpError = NotModifiedHttpError;
//# sourceMappingURL=NotModifiedHttpError.js.map