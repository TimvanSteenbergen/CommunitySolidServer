"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteOperationHandler = void 0;
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const ResetResponseDescription_1 = require("../output/response/ResetResponseDescription");
const OperationHandler_1 = require("./OperationHandler");
/**
 * Handles DELETE {@link Operation}s.
 * Calls the deleteResource function from a {@link ResourceStore}.
 */
class DeleteOperationHandler extends OperationHandler_1.OperationHandler {
    store;
    constructor(store) {
        super();
        this.store = store;
    }
    async canHandle({ operation }) {
        if (operation.method !== 'DELETE') {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('This handler only supports DELETE operations');
        }
    }
    async handle({ operation }) {
        await this.store.deleteResource(operation.target, operation.conditions);
        return new ResetResponseDescription_1.ResetResponseDescription();
    }
}
exports.DeleteOperationHandler = DeleteOperationHandler;
//# sourceMappingURL=DeleteOperationHandler.js.map