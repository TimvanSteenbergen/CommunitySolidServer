"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadOnlyStore = void 0;
const ForbiddenHttpError_1 = require("../util/errors/ForbiddenHttpError");
const PassthroughStore_1 = require("./PassthroughStore");
/**
 * Store that only allow read operations on the underlying source.
 */
/* eslint-disable unused-imports/no-unused-vars */
class ReadOnlyStore extends PassthroughStore_1.PassthroughStore {
    constructor(source) {
        super(source);
    }
    async addResource(container, representation, conditions) {
        throw new ForbiddenHttpError_1.ForbiddenHttpError();
    }
    async deleteResource(identifier, conditions) {
        throw new ForbiddenHttpError_1.ForbiddenHttpError();
    }
    async modifyResource(identifier, patch, conditions) {
        throw new ForbiddenHttpError_1.ForbiddenHttpError();
    }
    async setRepresentation(identifier, representation, conditions) {
        throw new ForbiddenHttpError_1.ForbiddenHttpError();
    }
}
exports.ReadOnlyStore = ReadOnlyStore;
//# sourceMappingURL=ReadOnlyStore.js.map