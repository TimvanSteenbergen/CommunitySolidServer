"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTypeReplacer = void 0;
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const ConversionUtil_1 = require("./ConversionUtil");
const TypedRepresentationConverter_1 = require("./TypedRepresentationConverter");
/**
 * A {@link RepresentationConverter} that changes the content type
 * but does not alter the representation.
 *
 * Useful for when a content type is binary-compatible with another one;
 * for instance, all JSON-LD files are valid JSON files.
 */
class ContentTypeReplacer extends TypedRepresentationConverter_1.TypedRepresentationConverter {
    contentTypeMap = {};
    constructor(replacements) {
        super();
        // Store the replacements as value preferences,
        // completing any transitive chains (A:B, B:C, C:D => A:B,C,D)
        for (const inputType of Object.keys(replacements)) {
            this.contentTypeMap[inputType] = {};
            (function addReplacements(inType, outTypes) {
                const replace = replacements[inType] ?? [];
                const newTypes = typeof replace === 'string' ? [replace] : replace;
                for (const newType of newTypes) {
                    if (!(newType in outTypes)) {
                        outTypes[newType] = 1;
                        addReplacements(newType, outTypes);
                    }
                }
            })(inputType, this.contentTypeMap[inputType]);
        }
    }
    async getOutputTypes(contentType) {
        const supported = Object.keys(this.contentTypeMap)
            .filter((type) => (0, ConversionUtil_1.matchesMediaType)(contentType, type))
            .map((type) => this.contentTypeMap[type]);
        return Object.assign({}, ...supported);
    }
    async canHandle({ representation, preferences }) {
        await this.getReplacementType(representation.metadata.contentType, preferences.type);
    }
    /**
     * Changes the content type on the representation.
     */
    async handle({ representation, preferences }) {
        const contentType = await this.getReplacementType(representation.metadata.contentType, preferences.type);
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(representation.metadata, contentType);
        return { ...representation, metadata };
    }
    async handleSafe(args) {
        return this.handle(args);
    }
    /**
     * Find a replacement content type that matches the preferences,
     * or throws an error if none was found.
     */
    async getReplacementType(contentType = 'unknown', preferred = {}) {
        const supported = await this.getOutputTypes(contentType);
        const match = (0, ConversionUtil_1.getConversionTarget)(supported, preferred);
        if (!match) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Cannot convert from ${contentType} to ${Object.keys(preferred).join(',')}`);
        }
        return match;
    }
}
exports.ContentTypeReplacer = ContentTypeReplacer;
//# sourceMappingURL=ContentTypeReplacer.js.map