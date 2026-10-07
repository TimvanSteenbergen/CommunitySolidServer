"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(401, 'UnauthorizedHttpError');
/**
 * An error thrown when an agent is not authorized.
 */
class UnauthorizedHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.UnauthorizedHttpError = UnauthorizedHttpError;
//# sourceMappingURL=UnauthorizedHttpError.js.map