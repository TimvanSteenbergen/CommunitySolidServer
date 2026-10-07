"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaterfallHandler = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../errors/InternalServerError");
const HandlerUtil_1 = require("./HandlerUtil");
/**
 * A composite handler that tries multiple handlers one by one
 * until it finds a handler that supports the input.
 * The handlers will be checked in the order they appear in the input array,
 * allowing for more fine-grained handlers to check before catch-all handlers.
 */
class WaterfallHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    handlers;
    /**
     * Creates a new WaterfallHandler that stores the given handlers.
     *
     * @param handlers - Handlers over which it will run.
     */
    constructor(handlers) {
        this.handlers = handlers;
    }
    /**
     * Checks whether any of the stored handlers can handle the given input.
     *
     * @param input - The data that would need to be handled.
     *
     * @returns A promise resolving if at least 1 handler supports to input, or rejecting if none do.
     */
    async canHandle(input) {
        await (0, HandlerUtil_1.findHandler)(this.handlers, input);
    }
    /**
     * Finds a handler that supports the given input and then lets it handle the given data.
     *
     * @param input - The data that needs to be handled.
     *
     * @returns A promise corresponding to the handle call of a handler that supports the input.
     * It rejects if no handlers support the given data.
     */
    async handle(input) {
        let handler;
        try {
            handler = await (0, HandlerUtil_1.findHandler)(this.handlers, input);
        }
        catch (error) {
            this.logger.warn('All handlers failed. This might be the consequence of calling handle before canHandle.');
            throw new InternalServerError_1.InternalServerError('All handlers failed', { cause: error });
        }
        return handler.handle(input);
    }
    /**
     * Identical to {@link AsyncHandler.handleSafe} but optimized for composite
     * by only needing 1 canHandle call on members.
     *
     * @param input - The input data.
     *
     * @returns A promise corresponding to the handle call of a handler that supports the input.
     * It rejects if no handlers support the given data.
     */
    async handleSafe(input) {
        const handler = await (0, HandlerUtil_1.findHandler)(this.handlers, input);
        return handler.handle(input);
    }
}
exports.WaterfallHandler = WaterfallHandler;
//# sourceMappingURL=WaterfallHandler.js.map