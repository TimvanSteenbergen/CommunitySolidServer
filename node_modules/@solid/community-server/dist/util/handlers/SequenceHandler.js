"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequenceHandler = void 0;
const AsyncHandler_1 = require("./AsyncHandler");
/**
 * A composite handler that will try to run all supporting handlers sequentially
 * and return the value of the last supported handler.
 * The `canHandle` check of this handler will always succeed.
 */
class SequenceHandler extends AsyncHandler_1.AsyncHandler {
    handlers;
    constructor(handlers) {
        super();
        this.handlers = [...handlers];
    }
    async handle(input) {
        let result;
        for (const handler of this.handlers) {
            let supported;
            try {
                await handler.canHandle(input);
                supported = true;
            }
            catch {
                supported = false;
            }
            if (supported) {
                result = await handler.handle(input);
            }
        }
        return result;
    }
}
exports.SequenceHandler = SequenceHandler;
//# sourceMappingURL=SequenceHandler.js.map