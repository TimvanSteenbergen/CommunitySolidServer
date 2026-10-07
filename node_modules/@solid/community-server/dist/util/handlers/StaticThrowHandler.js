"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticThrowHandler = void 0;
const AsyncHandler_1 = require("./AsyncHandler");
/**
 * Utility handler that can handle all input and always throws an instance of the given error.
 */
class StaticThrowHandler extends AsyncHandler_1.AsyncHandler {
    error;
    constructor(error) {
        super();
        this.error = error;
    }
    async handle() {
        // We are creating a new instance of the error instead of rethrowing the error,
        // as reusing the same error can cause problem as the metadata is then also reused.
        throw new this.error.constructor();
    }
}
exports.StaticThrowHandler = StaticThrowHandler;
//# sourceMappingURL=StaticThrowHandler.js.map