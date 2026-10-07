"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedMediaTypeHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(415, 'UnsupportedMediaTypeHttpError');
/**
 * An error thrown when the media type of incoming data is not supported by a parser.
 */
class UnsupportedMediaTypeHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.UnsupportedMediaTypeHttpError = UnsupportedMediaTypeHttpError;
//# sourceMappingURL=UnsupportedMediaTypeHttpError.js.map