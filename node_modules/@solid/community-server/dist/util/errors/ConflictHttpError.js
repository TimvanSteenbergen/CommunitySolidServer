"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictHttpError = void 0;
const HttpError_1 = require("./HttpError");
// eslint-disable-next-line @typescript-eslint/naming-convention
const BaseHttpError = (0, HttpError_1.generateHttpErrorClass)(409, 'ConflictHttpError');
/**
 * An error thrown when a request conflict with current state of the server.
 */
class ConflictHttpError extends BaseHttpError {
    constructor(message, options) {
        super(message, options);
    }
}
exports.ConflictHttpError = ConflictHttpError;
//# sourceMappingURL=ConflictHttpError.js.map