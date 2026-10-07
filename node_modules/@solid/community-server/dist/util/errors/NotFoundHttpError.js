"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(404, 'NotFoundHttpError');
/**
 * An error thrown when no data was found for the requested identifier.
 */
class NotFoundHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.NotFoundHttpError = NotFoundHttpError;
//# sourceMappingURL=NotFoundHttpError.js.map