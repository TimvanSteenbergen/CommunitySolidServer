"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(501, 'NotImplementedHttpError');
/**
 * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
 * Usually this implies future availability (e.g., a new feature of a web-service API).
 */
class NotImplementedHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.NotImplementedHttpError = NotImplementedHttpError;
//# sourceMappingURL=NotImplementedHttpError.js.map