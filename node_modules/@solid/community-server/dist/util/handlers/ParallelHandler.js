"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParallelHandler = void 0;
const AsyncHandler_1 = require("./AsyncHandler");
/**
 * A composite handler that executes handlers in parallel.
 */
class ParallelHandler extends AsyncHandler_1.AsyncHandler {
    handlers;
    constructor(handlers) {
        super();
        this.handlers = [...handlers];
    }
    async canHandle(input) {
        await Promise.all(this.handlers.map(async (handler) => handler.canHandle(input)));
    }
    async handle(input) {
        return Promise.all(this.handlers.map(async (handler) => handler.handle(input)));
    }
}
exports.ParallelHandler = ParallelHandler;
//# sourceMappingURL=ParallelHandler.js.map