"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedAsyncHandler = void 0;
const NotImplementedHttpError_1 = require("../errors/NotImplementedHttpError");
const AsyncHandler_1 = require("./AsyncHandler");
/**
 * Handler that does not support any input and will always throw an error.
 */
class UnsupportedAsyncHandler extends AsyncHandler_1.AsyncHandler {
    errorMessage;
    constructor(errorMessage) {
        super();
        this.errorMessage = errorMessage;
    }
    async canHandle() {
        throw new NotImplementedHttpError_1.NotImplementedHttpError(this.errorMessage);
    }
    async handle() {
        return this.canHandle();
    }
}
exports.UnsupportedAsyncHandler = UnsupportedAsyncHandler;
//# sourceMappingURL=UnsupportedAsyncHandler.js.map