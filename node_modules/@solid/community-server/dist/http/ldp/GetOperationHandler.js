"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOperationHandler = void 0;
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const ResourceUtil_1 = require("../../util/ResourceUtil");
const OkResponseDescription_1 = require("../output/response/OkResponseDescription");
const OperationHandler_1 = require("./OperationHandler");
/**
 * Handles GET {@link Operation}s.
 * Calls the getRepresentation function from a {@link ResourceStore}.
 */
class GetOperationHandler extends OperationHandler_1.OperationHandler {
    store;
    eTagHandler;
    constructor(store, eTagHandler) {
        super();
        this.store = store;
        this.eTagHandler = eTagHandler;
    }
    async canHandle({ operation }) {
        if (operation.method !== 'GET') {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('This handler only supports GET operations');
        }
    }
    async handle({ operation }) {
        const body = await this.store.getRepresentation(operation.target, operation.preferences, operation.conditions);
        // Check whether the cached representation is still valid or it is necessary to send a new representation
        (0, ResourceUtil_1.assertReadConditions)(body, this.eTagHandler, operation.conditions);
        return new OkResponseDescription_1.OkResponseDescription(body.metadata, body.data);
    }
}
exports.GetOperationHandler = GetOperationHandler;
//# sourceMappingURL=GetOperationHandler.js.map