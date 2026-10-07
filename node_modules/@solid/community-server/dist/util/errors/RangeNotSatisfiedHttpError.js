"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeNotSatisfiedHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(416, 'RangeNotSatisfiedHttpError');
/**
 * An error thrown when the requested range is not supported.
 */
class RangeNotSatisfiedHttpError extends BaseHttpError {
    /**
     * Default message is 'The requested range is not supported.'.
     *
     * @param message - Optional, more specific, message.
     * @param options - Optional error options.
     */
    constructor(message, options) {
        super(message ?? 'The requested range is not supported.', options);
    }
}
exports.RangeNotSatisfiedHttpError = RangeNotSatisfiedHttpError;
//# sourceMappingURL=RangeNotSatisfiedHttpError.js.map