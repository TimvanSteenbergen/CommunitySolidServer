"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionHandler = void 0;
const PromiseUtil_1 = require("../PromiseUtil");
const AsyncHandler_1 = require("./AsyncHandler");
const HandlerUtil_1 = require("./HandlerUtil");
/**
 * Utility handler that allows combining the results of multiple handlers into one.
 * Will run the handlers and then call the abstract `combine` function with the results,
 * which then generates the handler's output.
 */
class UnionHandler extends AsyncHandler_1.AsyncHandler {
    handlers;
    requireAll;
    ignoreErrors;
    /**
     * Creates a new `UnionHandler`.
     *
     * When `requireAll` is false or `ignoreErrors` is true,
     * the length of the input to `combine` can vary;
     * otherwise, it is exactly the number of handlers.
     *
     * @param handlers - The handlers whose output is to be combined.
     * @param requireAll - If true, will fail if any of the handlers do not support the input.
                           If false, only the handlers that support the input will be called;
     *                     will fail only if none of the handlers can handle the input.
     * @param ignoreErrors - If true, ignores handlers that fail by omitting their output;
     *                       if false, fails when any handlers fail.
     */
    constructor(handlers, requireAll = false, ignoreErrors = !requireAll) {
        super();
        this.handlers = handlers;
        this.requireAll = requireAll;
        this.ignoreErrors = ignoreErrors;
    }
    async canHandle(input) {
        if (this.requireAll) {
            await this.allCanHandle(input);
        }
        else {
            // This will error if no handler supports the input
            await (0, HandlerUtil_1.findHandler)(this.handlers, input);
        }
    }
    async handle(input) {
        const handlers = this.requireAll ? this.handlers : (await (0, HandlerUtil_1.filterHandlers)(this.handlers, input));
        const results = handlers.map(async (handler) => (handler.handle(input)));
        return this.combine(await (0, PromiseUtil_1.allFulfilled)(results, this.ignoreErrors));
    }
    /**
     * Checks if all handlers can handle the input.
     * If not, throw an error based on the errors of the failed handlers.
     */
    async allCanHandle(input) {
        await (0, PromiseUtil_1.allFulfilled)(this.handlers.map(async (handler) => handler.canHandle(input)));
    }
}
exports.UnionHandler = UnionHandler;
//# sourceMappingURL=UnionHandler.js.map