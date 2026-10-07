"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTypedRepresentationConverter = void 0;
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const ConversionUtil_1 = require("./ConversionUtil");
const TypedRepresentationConverter_1 = require("./TypedRepresentationConverter");
async function toValuePreferences(arg) {
    const resolved = await arg;
    if (typeof resolved === 'string') {
        return { [resolved]: 1 };
    }
    if (Array.isArray(resolved)) {
        return Object.fromEntries(resolved.map((type) => [type, 1]));
    }
    return resolved;
}
/**
 * A base {@link TypedRepresentationConverter} implementation for converters
 * that can convert from all its input types to all its output types.
 *
 * This base class handles the `canHandle` call by comparing the input content type to the stored input types
 * and the output preferences to the stored output types.
 *
 * Output weights are determined by multiplying all stored output weights with the weight of the input type.
 */
class BaseTypedRepresentationConverter extends TypedRepresentationConverter_1.TypedRepresentationConverter {
    inputTypes;
    outputTypes;
    constructor(inputTypes, outputTypes) {
        super();
        this.inputTypes = toValuePreferences(inputTypes);
        this.outputTypes = toValuePreferences(outputTypes);
    }
    /**
     * Matches all inputs to all outputs.
     */
    async getOutputTypes(contentType) {
        const weight = (0, ConversionUtil_1.getTypeWeight)(contentType, await this.inputTypes);
        if (weight > 0) {
            const outputTypes = { ...await this.outputTypes };
            for (const [key, value] of Object.entries(outputTypes)) {
                outputTypes[key] = value * weight;
            }
            return outputTypes;
        }
        return {};
    }
    /**
     * Determines whether the given conversion request is supported,
     * given the available content type conversions:
     *  - Checks if there is a content type for the input.
     *  - Checks if the input type is supported by the parser.
     *  - Checks if the parser can produce one of the preferred output types.
     * Throws an error with details if conversion is not possible.
     */
    async canHandle(args) {
        const { contentType } = args.representation.metadata;
        if (!contentType) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Can not convert data without a Content-Type.');
        }
        const outputTypes = await this.getOutputTypes(contentType);
        const outputPreferences = args.preferences.type ?? {};
        if (!(0, ConversionUtil_1.getConversionTarget)(outputTypes, outputPreferences)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Cannot convert from ${contentType} to ${(0, ConversionUtil_1.preferencesToString)(outputPreferences)}, only to ${(0, ConversionUtil_1.preferencesToString)(outputTypes)}.`);
        }
    }
}
exports.BaseTypedRepresentationConverter = BaseTypedRepresentationConverter;
//# sourceMappingURL=BaseTypedRepresentationConverter.js.map