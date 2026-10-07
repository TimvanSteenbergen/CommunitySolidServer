"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchingStore = void 0;
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
const PassthroughStore_1 = require("./PassthroughStore");
/**
 * {@link ResourceStore} using decorator pattern for the `modifyResource` function.
 * If the original store supports the {@link Patch}, behaviour will be identical,
 * otherwise the {@link PatchHandler} will be called instead.
 */
class PatchingStore extends PassthroughStore_1.PassthroughStore {
    patchHandler;
    constructor(source, patchHandler) {
        super(source);
        this.patchHandler = patchHandler;
    }
    async modifyResource(identifier, patch, conditions) {
        try {
            return await this.source.modifyResource(identifier, patch, conditions);
        }
        catch (error) {
            if (NotImplementedHttpError_1.NotImplementedHttpError.isInstance(error)) {
                return this.patchHandler.handleSafe({ source: this.source, identifier, patch });
            }
            throw error;
        }
    }
}
exports.PatchingStore = PatchingStore;
//# sourceMappingURL=PatchingStore.js.map