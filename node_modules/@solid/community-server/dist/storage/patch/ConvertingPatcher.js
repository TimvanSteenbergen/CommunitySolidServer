"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertingPatcher = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const LogUtil_1 = require("../../logging/LogUtil");
const RepresentationPatcher_1 = require("./RepresentationPatcher");
/**
 * A `ConvertingPatcher` converts a document to its `intermediateType`,
 * sends the result to the wrapped patcher, and then converts back to its original type.
 * No changes will take place if no `intermediateType` is provided.
 *
 * In case there is no resource yet and a new one needs to be created,
 * the result of the wrapped patcher will be converted to the provided `defaultType`.
 * In case no `defaultType` is provided, the patcher output will be returned directly.
 */
class ConvertingPatcher extends RepresentationPatcher_1.RepresentationPatcher {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    patcher;
    converter;
    intermediateType;
    defaultType;
    /**
     * @param patcher - Patcher that will be called with the Representation.
     * @param converter - Converter that will be used to generate intermediate Representation.
     * @param intermediateType - Content-type of the intermediate Representation if conversion is needed.
     * @param defaultType - Content-type in case a new resource gets created and needs to be converted.
     */
    constructor(patcher, converter, intermediateType, defaultType) {
        super();
        this.patcher = patcher;
        this.converter = converter;
        this.intermediateType = intermediateType;
        this.defaultType = defaultType;
    }
    async canHandle(input) {
        // Verify the converter can handle the input representation if needed
        const { identifier, representation } = input;
        let convertedPlaceholder = representation;
        if (representation && this.intermediateType) {
            const preferences = { type: { [this.intermediateType]: 1 } };
            await this.converter.canHandle({ representation, identifier, preferences });
            convertedPlaceholder = new BasicRepresentation_1.BasicRepresentation([], representation.metadata, this.intermediateType);
        }
        // Verify the patcher can handle the (converted) representation
        await this.patcher.canHandle({ ...input, representation: convertedPlaceholder });
    }
    async handle(input) {
        const { identifier, representation } = input;
        let outputType;
        let converted = representation;
        if (!representation) {
            // If there is no representation the output will need to be converted to the default type
            outputType = this.defaultType;
        }
        else if (this.intermediateType) {
            // Convert incoming representation to the requested type
            outputType = representation.metadata.contentType;
            const preferences = { type: { [this.intermediateType]: 1 } };
            converted = await this.converter.handle({ representation, identifier, preferences });
        }
        // Call the wrapped patcher with the (potentially) converted representation
        let result = await this.patcher.handle({ ...input, representation: converted });
        // Convert the output back to its original type or the default type depending on what was set
        if (outputType) {
            const preferences = { type: { [outputType]: 1 } };
            result = await this.converter.handle({ representation: result, identifier, preferences });
        }
        return result;
    }
}
exports.ConvertingPatcher = ConvertingPatcher;
//# sourceMappingURL=ConvertingPatcher.js.map