"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermanentRedirectHttpError = void 0;
const RedirectHttpError_1 = require("./RedirectHttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, RedirectHttpError_1.generateRedirectHttpErrorClass)(308, 'PermanentRedirectHttpError');
/**
 * Error used for resources that have been moved permanently.
 * Method and body should not be changed in subsequent requests.
 */
class PermanentRedirectHttpError extends BaseHttpError {
    constructor(location, message, options) {
        super(location, message, options);
    }
}
exports.PermanentRedirectHttpError = PermanentRedirectHttpError;
//# sourceMappingURL=PermanentRedirectHttpError.js.map