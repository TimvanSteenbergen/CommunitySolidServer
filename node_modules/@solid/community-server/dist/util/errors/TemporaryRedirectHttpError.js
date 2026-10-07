"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporaryRedirectHttpError = void 0;
const RedirectHttpError_1 = require("./RedirectHttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, RedirectHttpError_1.generateRedirectHttpErrorClass)(307, 'TemporaryRedirectHttpError');
/**
 * Error used for resources that have been moved temporarily.
 * Method and body should not be changed in subsequent requests.
 */
class TemporaryRedirectHttpError extends BaseHttpError {
    constructor(location, message, options) {
        super(location, message, options);
    }
}
exports.TemporaryRedirectHttpError = TemporaryRedirectHttpError;
//# sourceMappingURL=TemporaryRedirectHttpError.js.map