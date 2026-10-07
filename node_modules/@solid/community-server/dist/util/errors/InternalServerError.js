"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(500, 'InternalServerError');
/**
 * A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
 */
class InternalServerError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=InternalServerError.js.map