"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(422, 'UnprocessableEntityHttpError');
/**
 * An error thrown when the server understands the content-type but can't process the instructions.
 */
class UnprocessableEntityHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.UnprocessableEntityHttpError = UnprocessableEntityHttpError;
//# sourceMappingURL=UnprocessableEntityHttpError.js.map