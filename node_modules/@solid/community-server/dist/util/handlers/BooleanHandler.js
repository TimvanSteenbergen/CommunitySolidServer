"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanHandler = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../errors/InternalServerError");
const PromiseUtil_1 = require("../PromiseUtil");
const AsyncHandler_1 = require("./AsyncHandler");
const HandlerUtil_1 = require("./HandlerUtil");
/**
 * A composite handler that returns true if any of its handlers can handle the input and return true.
 * Handler errors are interpreted as false results.
 */
class BooleanHandler extends AsyncHandler_1.AsyncHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    handlers;
    /**
     * Creates a new BooleanHandler that stores the given handlers.
     *
     * @param handlers - Handlers over which it will run.
     */
    constructor(handlers) {
        super();
        this.handlers = handlers;
    }
    async canHandle(input) {
        // We use this to generate an error if no handler supports the input
        await (0, HandlerUtil_1.filterHandlers)(this.handlers, input);
    }
    async handleSafe(input) {
        const handlers = await (0, HandlerUtil_1.filterHandlers)(this.handlers, input);
        return (0, PromiseUtil_1.promiseSome)(handlers.map(async (handler) => handler.handle(input)));
    }
    async handle(input) {
        let handlers;
        try {
            handlers = await (0, HandlerUtil_1.filterHandlers)(this.handlers, input);
        }
        catch (error) {
            this.logger.warn('All handlers failed. This might be the consequence of calling handle before canHandle.');
            throw new InternalServerError_1.InternalServerError('All handlers failed', { cause: error });
        }
        return (0, PromiseUtil_1.promiseSome)(handlers.map(async (handler) => handler.handle(input)));
    }
}
exports.BooleanHandler = BooleanHandler;
//# sourceMappingURL=BooleanHandler.js.map