"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(400, 'BadRequestHttpError');
/**
 * An error thrown when incoming data is not supported.
 * Probably because an {@link AsyncHandler} returns false on the canHandle call.
 */
class BadRequestHttpError extends BaseHttpError {
    /**
     * Default message is 'The given input is not supported by the server configuration.'.
     *
     * @param message - Optional, more specific, message.
     * @param options - Optional error options.
     */
    constructor(message, options) {
        super(message ?? 'The given input is not supported by the server configuration.', options);
    }
}
exports.BadRequestHttpError = BadRequestHttpError;
//# sourceMappingURL=BadRequestHttpError.js.map