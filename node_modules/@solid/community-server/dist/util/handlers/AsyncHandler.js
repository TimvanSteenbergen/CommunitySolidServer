"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncHandler = void 0;
/**
 * Simple interface for classes that can potentially handle a specific kind of data asynchronously.
 */
class AsyncHandler {
    /**
     * Checks whether the input can be handled by this class.
     * If it cannot handle the input, rejects with an error explaining why.
     *
     * @param input - Input that could potentially be handled.
     *
     * @returns A promise resolving if the input can be handled, rejecting with an Error if not.
     */
    // eslint-disable-next-line unused-imports/no-unused-vars
    async canHandle(input) {
        // Support any input by default
    }
    /**
     * Helper function that first runs {@link canHandle} followed by {@link handle}.
     * Throws the error of {@link canHandle} if the data cannot be handled,
     * or returns the result of {@link handle} otherwise.
     *
     * @param input - Input data that will be handled if it can be handled.
     *
     * @returns A promise resolving if the input can be handled, rejecting with an Error if not.
     */
    async handleSafe(input) {
        await this.canHandle(input);
        return this.handle(input);
    }
}
exports.AsyncHandler = AsyncHandler;
//# sourceMappingURL=AsyncHandler.js.map