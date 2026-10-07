"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdfValidator = void 0;
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const ContentTypes_1 = require("../../util/ContentTypes");
const ResourceUtil_1 = require("../../util/ResourceUtil");
const Validator_1 = require("./Validator");
/**
 * Validates a Representation by verifying if the data stream contains valid RDF data.
 * It does this by letting the stored RepresentationConverter convert the data.
 */
class RdfValidator extends Validator_1.Validator {
    converter;
    constructor(converter) {
        super();
        this.converter = converter;
    }
    async handle({ representation, identifier }) {
        // If the data already is quads format we know it's RDF
        if (representation.metadata.contentType === ContentTypes_1.INTERNAL_QUADS) {
            return representation;
        }
        const preferences = { type: { [ContentTypes_1.INTERNAL_QUADS]: 1 } };
        let result;
        try {
            // Creating new representation since converter might edit metadata
            const tempRepresentation = await (0, ResourceUtil_1.cloneRepresentation)(representation);
            result = await this.converter.handleSafe({
                identifier,
                representation: tempRepresentation,
                preferences,
            });
        }
        catch (error) {
            representation.data.destroy();
            throw error;
        }
        // Drain stream to make sure data was parsed correctly
        await (0, arrayify_stream_1.default)(result.data);
        return representation;
    }
}
exports.RdfValidator = RdfValidator;
//# sourceMappingURL=RdfValidator.js.map