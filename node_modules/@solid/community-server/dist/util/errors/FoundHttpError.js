"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundHttpError = void 0;
const RedirectHttpError_1 = require("./RedirectHttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, RedirectHttpError_1.generateRedirectHttpErrorClass)(302, 'FoundHttpError');
/**
 * Error used for resources that have been moved temporarily.
 * Methods other than GET may or may not be changed to GET in subsequent requests.
 */
class FoundHttpError extends BaseHttpError {
    constructor(location, message, options) {
        super(location, message, options);
    }
}
exports.FoundHttpError = FoundHttpError;
//# sourceMappingURL=FoundHttpError.js.map