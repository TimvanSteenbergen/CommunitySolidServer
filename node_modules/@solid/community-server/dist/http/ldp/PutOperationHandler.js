"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutOperationHandler = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const MethodNotAllowedHttpError_1 = require("../../util/errors/MethodNotAllowedHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const CreatedResponseDescription_1 = require("../output/response/CreatedResponseDescription");
const ResetResponseDescription_1 = require("../output/response/ResetResponseDescription");
const OperationHandler_1 = require("./OperationHandler");
/**
 * Handles PUT {@link Operation}s.
 * Calls the setRepresentation function from a {@link ResourceStore}.
 */
class PutOperationHandler extends OperationHandler_1.OperationHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    store;
    metadataStrategy;
    constructor(store, metadataStrategy) {
        super();
        this.store = store;
        this.metadataStrategy = metadataStrategy;
    }
    async canHandle({ operation }) {
        if (operation.method !== 'PUT') {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('This handler only supports PUT operations');
        }
    }
    async handle({ operation }) {
        const targetIsContainer = (0, PathUtil_1.isContainerPath)(operation.target.path);
        // Solid, §2.1: "A Solid server MUST reject PUT, POST and PATCH requests
        // without the Content-Type header with a status code of 400."
        // https://solid.github.io/specification/protocol#http-server
        // An exception is made for LDP Containers as nothing is done with the body, so a Content-type is not required
        if (!operation.body.metadata.contentType && !targetIsContainer) {
            this.logger.warn('PUT requests require the Content-Type header to be set');
            throw new BadRequestHttpError_1.BadRequestHttpError('PUT requests require the Content-Type header to be set');
        }
        // https://github.com/CommunitySolidServer/CommunitySolidServer/issues/1027#issuecomment-988664970
        // We do not allow PUT on metadata resources for simplicity.
        // Otherwise, all generated metadata triples would have to be identical, such as date modified.
        // We already reject the request here instead of `setRepresentation` so PATCH requests
        // can still use that function to update data.
        if (this.metadataStrategy.isAuxiliaryIdentifier(operation.target)) {
            throw new MethodNotAllowedHttpError_1.MethodNotAllowedHttpError(['PUT'], 'Not allowed to create or edit metadata resources using PUT; use PATCH instead.');
        }
        // A more efficient approach would be to have the server return metadata indicating if a resource was new
        // See https://github.com/CommunitySolidServer/CommunitySolidServer/issues/632
        const exists = await this.store.hasResource(operation.target);
        await this.store.setRepresentation(operation.target, operation.body, operation.conditions);
        if (exists) {
            return new ResetResponseDescription_1.ResetResponseDescription();
        }
        return new CreatedResponseDescription_1.CreatedResponseDescription(operation.target);
    }
}
exports.PutOperationHandler = PutOperationHandler;
//# sourceMappingURL=PutOperationHandler.js.map