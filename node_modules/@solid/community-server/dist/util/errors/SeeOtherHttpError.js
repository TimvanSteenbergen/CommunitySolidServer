"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeeOtherHttpError = void 0;
const RedirectHttpError_1 = require("./RedirectHttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, RedirectHttpError_1.generateRedirectHttpErrorClass)(303, 'SeeOtherHttpError');
/**
 * Error used to redirect not to the requested resource itself, but to another page,
 * for example a representation of a real-world object.
 * The method used to display this redirected page is always GET.
 */
class SeeOtherHttpError extends BaseHttpError {
    constructor(location, message, options) {
        super(location, message, options);
    }
}
exports.SeeOtherHttpError = SeeOtherHttpError;
//# sourceMappingURL=SeeOtherHttpError.js.map