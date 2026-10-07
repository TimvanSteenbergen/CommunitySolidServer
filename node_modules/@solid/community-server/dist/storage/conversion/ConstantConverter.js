"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantConverter = void 0;
const node_fs_1 = require("node:fs");
const fs_extra_1 = require("fs-extra");
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const LogUtil_1 = require("../../logging/LogUtil");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const TermUtil_1 = require("../../util/TermUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const ConversionUtil_1 = require("./ConversionUtil");
const RepresentationConverter_1 = require("./RepresentationConverter");
/**
 * A {@link RepresentationConverter} that ensures
 * a representation for a certain content type is available.
 *
 * Representations of the same content type are served as is;
 * others are replaced by a constant document.
 *
 * This can for example be used to serve an index.html file,
 * which could then interactively load another representation.
 *
 * Options default to the most permissive values when not defined.
 */
class ConstantConverter extends RepresentationConverter_1.RepresentationConverter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    filePath;
    contentType;
    options;
    /**
     * Creates a new constant converter.
     *
     * @param filePath - The path to the constant representation.
     * @param contentType - The content type of the constant representation.
     * @param options - Extra options for the converter.
     */
    constructor(filePath, contentType, options = {}) {
        super();
        this.filePath = filePath;
        this.contentType = contentType;
        this.options = {
            container: options.container ?? true,
            document: options.document ?? true,
            minQuality: options.minQuality ?? 0,
            enabledMediaRanges: options.enabledMediaRanges ?? ['*/*'],
            disabledMediaRanges: options.disabledMediaRanges ?? [],
        };
    }
    async canHandle({ identifier, preferences, representation }) {
        // Do not replace the representation if there is no preference for our content type
        if (!preferences.type) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('No content type preferences specified');
        }
        // Do not replace the representation of unsupported resource types
        const isContainer = (0, PathUtil_1.isContainerIdentifier)(identifier);
        if (isContainer && !this.options.container) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Containers are not supported');
        }
        if (!isContainer && !this.options.document) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Documents are not supported');
        }
        // Do not replace the representation if the preference weight is too low
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const quality = (0, ConversionUtil_1.getTypeWeight)(this.contentType, (0, ConversionUtil_1.cleanPreferences)({ ...preferences.type, '*/*': 0 }));
        if (quality === 0) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`No preference for ${this.contentType}`);
        }
        else if (quality < this.options.minQuality) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Preference is lower than the specified minimum quality`);
        }
        const sourceContentType = representation.metadata.contentType ?? '';
        // Do not replace the representation if it already has our content type
        if ((0, ConversionUtil_1.matchesMediaType)(sourceContentType, this.contentType)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Representation is already ${this.contentType}`);
        }
        // Only replace the representation if it matches the media range settings
        if (!isContainer &&
            !this.options.enabledMediaRanges.some((type) => (0, ConversionUtil_1.matchesMediaType)(sourceContentType, type))) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`${sourceContentType} is not one of the enabled media types.`);
        }
        if (!isContainer &&
            this.options.disabledMediaRanges.some((type) => (0, ConversionUtil_1.matchesMediaType)(sourceContentType, type))) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`${sourceContentType} is one of the disabled media types.`);
        }
    }
    async handle({ representation }) {
        // Ignore the original representation
        representation.data.destroy();
        // Get the stats to have the correct size metadata
        let stats;
        try {
            stats = await (0, fs_extra_1.stat)(this.filePath);
        }
        catch (error) {
            this.logger.error(`Unable to access ${this.filePath}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            // Not giving out details in error as it contains internal server information
            throw new InternalServerError_1.InternalServerError(`Unable to access file used for constant conversion.`);
        }
        // Create a new representation from the constant file
        const data = (0, node_fs_1.createReadStream)(this.filePath, 'utf8');
        representation.metadata.set(Vocabularies_1.POSIX.terms.size, (0, TermUtil_1.toLiteral)(stats.size, Vocabularies_1.XSD.terms.integer));
        return new BasicRepresentation_1.BasicRepresentation(data, representation.metadata, this.contentType);
    }
}
exports.ConstantConverter = ConstantConverter;
//# sourceMappingURL=ConstantConverter.js.map