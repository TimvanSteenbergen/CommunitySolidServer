"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(413, 'PayloadHttpError');
/**
 * An error thrown when data exceeded the preconfigured quota
 */
class PayloadHttpError extends BaseHttpError {
    /**
     * Default message is 'Storage quota was exceeded.'.
     *
     * @param message - Optional, more specific, message.
     * @param options - Optional error options.
     */
    constructor(message, options) {
        super(message ?? 'Storage quota was exceeded.', options);
    }
}
exports.PayloadHttpError = PayloadHttpError;
//# sourceMappingURL=PayloadHttpError.js.map