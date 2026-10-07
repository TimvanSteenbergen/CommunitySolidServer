"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonConversionHandler = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const ContentTypes_1 = require("../../util/ContentTypes");
const StreamUtil_1 = require("../../util/StreamUtil");
const InteractionHandler_1 = require("./InteractionHandler");
/**
 * An {@link InteractionHandler} that sits in-between
 * an {@link InteractionHandler} and a {@link JsonInteractionHandler}.
 * It converts the input data stream into a JSON object to be used by the stored handler.
 *
 * Since the JSON body is only made during the `handle` call, it can not be used during the `canHandle`,
 * so the `canHandle` call of the stored handler is not called,
 * meaning this class accepts all input that can be converted to JSON.
 */
class JsonConversionHandler extends InteractionHandler_1.InteractionHandler {
    source;
    converter;
    constructor(source, converter) {
        super();
        this.source = source;
        this.converter = converter;
    }
    async canHandle({ operation }) {
        if (!operation.body.isEmpty) {
            await this.converter.canHandle({
                identifier: operation.target,
                preferences: { type: { [ContentTypes_1.APPLICATION_JSON]: 1 } },
                representation: operation.body,
            });
        }
    }
    async handle({ operation, oidcInteraction, accountId }) {
        let json = {};
        let jsonMetadata = operation.body.metadata;
        // Convert to JSON and read out if there is a body
        if (!operation.body.isEmpty) {
            const converted = await this.converter.handle({
                identifier: operation.target,
                preferences: { type: { [ContentTypes_1.APPLICATION_JSON]: 1 } },
                representation: operation.body,
            });
            json = await (0, StreamUtil_1.readJsonStream)(converted.data);
            jsonMetadata = converted.metadata;
        }
        // Input for the handler
        const input = {
            method: operation.method,
            target: operation.target,
            metadata: jsonMetadata,
            json,
            oidcInteraction,
            accountId,
        };
        const result = await this.source.handleSafe(input);
        // Convert the response JSON back to a Representation
        const responseMetadata = result.metadata ?? new RepresentationMetadata_1.RepresentationMetadata(operation.target);
        return new BasicRepresentation_1.BasicRepresentation(JSON.stringify(result.json), responseMetadata, ContentTypes_1.APPLICATION_JSON);
    }
}
exports.JsonConversionHandler = JsonConversionHandler;
//# sourceMappingURL=JsonConversionHandler.js.map