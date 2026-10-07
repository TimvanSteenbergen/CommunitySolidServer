"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertingOperationHttpHandler = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const OperationHttpHandler_1 = require("../OperationHttpHandler");
/**
 * An {@link OperationHttpHandler} that converts the response of its handler based on the {@link Operation} preferences.
 * If there are no preferences, or no data, the response will be returned as-is.
 */
class ConvertingOperationHttpHandler extends OperationHttpHandler_1.OperationHttpHandler {
    converter;
    operationHandler;
    constructor(converter, operationHandler) {
        super();
        this.converter = converter;
        this.operationHandler = operationHandler;
    }
    async canHandle(input) {
        await this.operationHandler.canHandle(input);
    }
    async handle(input) {
        const response = await this.operationHandler.handle(input);
        if (input.operation.preferences.type && response.data) {
            if (!response.metadata) {
                throw new InternalServerError_1.InternalServerError('A data stream should always have a metadata object.');
            }
            const representation = new BasicRepresentation_1.BasicRepresentation(response.data, response.metadata);
            const converted = await this.converter.handleSafe({
                identifier: input.operation.target,
                representation,
                preferences: input.operation.preferences,
            });
            response.metadata = converted.metadata;
            response.data = converted.data;
        }
        return response;
    }
}
exports.ConvertingOperationHttpHandler = ConvertingOperationHttpHandler;
//# sourceMappingURL=ConvertingOperationHttpHandler.js.map