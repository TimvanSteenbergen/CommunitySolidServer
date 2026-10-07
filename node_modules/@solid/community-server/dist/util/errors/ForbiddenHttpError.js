"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(403, 'ForbiddenHttpError');
/**
 * An error thrown when an agent is not allowed to access data.
 */
class ForbiddenHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.ForbiddenHttpError = ForbiddenHttpError;
//# sourceMappingURL=ForbiddenHttpError.js.map