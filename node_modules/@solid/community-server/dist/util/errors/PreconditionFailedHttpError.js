"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreconditionFailedHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(412, 'PreconditionFailedHttpError');
/**
 * An error thrown when access was denied due to the conditions on the request.
 */
class PreconditionFailedHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.PreconditionFailedHttpError = PreconditionFailedHttpError;
//# sourceMappingURL=PreconditionFailedHttpError.js.map