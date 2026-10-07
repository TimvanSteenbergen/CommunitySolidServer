"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDescription = void 0;
/**
 * The result of executing an operation.
 */
class ResponseDescription {
    statusCode;
    metadata;
    data;
    /**
     * @param statusCode - Status code to return.
     * @param metadata - Metadata corresponding to the response (and data potentially).
     * @param data - Data that needs to be returned. @ignored
     */
    constructor(statusCode, metadata, data) {
        this.statusCode = statusCode;
        this.metadata = metadata;
        this.data = data;
    }
}
exports.ResponseDescription = ResponseDescription;
//# sourceMappingURL=ResponseDescription.js.map