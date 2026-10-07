"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadOperationHandler = void 0;
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const ResourceUtil_1 = require("../../util/ResourceUtil");
const OkResponseDescription_1 = require("../output/response/OkResponseDescription");
const OperationHandler_1 = require("./OperationHandler");
/**
 * Handles HEAD {@link Operation}s.
 * Calls the getRepresentation function from a {@link ResourceStore}.
 */
class HeadOperationHandler extends OperationHandler_1.OperationHandler {
    store;
    eTagHandler;
    constructor(store, eTagHandler) {
        super();
        this.store = store;
        this.eTagHandler = eTagHandler;
    }
    async canHandle({ operation }) {
        if (operation.method !== 'HEAD') {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('This handler only supports HEAD operations');
        }
    }
    async handle({ operation }) {
        const body = await this.store.getRepresentation(operation.target, operation.preferences, operation.conditions);
        // Check whether the cached representation is still valid or it is necessary to send a new representation.
        // Generally it doesn't make much sense to use condition headers with a HEAD request, but it should be supported.
        (0, ResourceUtil_1.assertReadConditions)(body, this.eTagHandler, operation.conditions);
        // Close the Readable as we will not return it.
        body.data.destroy();
        return new OkResponseDescription_1.OkResponseDescription(body.metadata);
    }
}
exports.HeadOperationHandler = HeadOperationHandler;
//# sourceMappingURL=HeadOperationHandler.js.map