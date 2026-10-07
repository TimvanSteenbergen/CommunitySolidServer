"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalHandler = void 0;
const NotImplementedHttpError_1 = require("../errors/NotImplementedHttpError");
const AsyncHandler_1 = require("./AsyncHandler");
/**
 * This handler will pass all requests to the wrapped handler,
 * until a specific value has been set in the given storage.
 * After that all input will be rejected.
 * Once the value has been matched this behaviour will be cached,
 * so changing the value again afterwards will not enable this handler again.
 *
 * If `handleStorage` is set to `true`,
 * this handler will set the value itself in the given storage after the source handler successfully resolved.
 */
class ConditionalHandler extends AsyncHandler_1.AsyncHandler {
    source;
    storage;
    storageKey;
    storageValue;
    handleStorage;
    finished;
    constructor(source, storage, storageKey, storageValue, handleStorage = false) {
        super();
        this.source = source;
        this.storage = storage;
        this.storageKey = storageKey;
        this.storageValue = storageValue;
        this.handleStorage = handleStorage;
        this.finished = false;
    }
    async canHandle(input) {
        await this.checkCondition();
        await this.source.canHandle(input);
    }
    async handleSafe(input) {
        await this.checkCondition();
        const result = await this.source.handleSafe(input);
        if (this.handleStorage) {
            await this.storage.set(this.storageKey, this.storageValue);
            this.finished = true;
        }
        return result;
    }
    async handle(input) {
        const result = await this.source.handle(input);
        if (this.handleStorage) {
            await this.storage.set(this.storageKey, this.storageValue);
            this.finished = true;
        }
        return result;
    }
    /**
     * Checks if the condition has already been fulfilled.
     */
    async checkCondition() {
        if (!this.finished) {
            this.finished = await this.storage.get(this.storageKey) === this.storageValue;
        }
        if (this.finished) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('The condition has been fulfilled.');
        }
    }
}
exports.ConditionalHandler = ConditionalHandler;
//# sourceMappingURL=ConditionalHandler.js.map