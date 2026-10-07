"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepresentationConvertingStore = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const ContentTypes_1 = require("../util/ContentTypes");
const PassthroughConverter_1 = require("./conversion/PassthroughConverter");
const PassthroughStore_1 = require("./PassthroughStore");
/**
 * Store that provides (optional) conversion of incoming and outgoing {@link Representation}s.
 */
class RepresentationConvertingStore extends PassthroughStore_1.PassthroughStore {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    metadataStrategy;
    inConverter;
    outConverter;
    inPreferences;
    /**
     * @param source - Store we retrieve data from and send data to.
     * @param metadataStrategy - Used to distinguish regular resources (which may be converted)
     *                           from metadata resources (which always need conversion).
     * @param options - Determines when data should be converted.
     * @param options.outConverter - Converts data after retrieval from the source store.
     * @param options.inConverter - Converts data before passing to the source store.
     * @param options.inPreferences - The preferred input format for the source store, as passed to the inConverter.
     */
    constructor(source, metadataStrategy, options) {
        super(source);
        const { inConverter, outConverter, inPreferences } = options;
        this.metadataStrategy = metadataStrategy;
        this.inConverter = inConverter ?? new PassthroughConverter_1.PassthroughConverter();
        this.outConverter = outConverter ?? new PassthroughConverter_1.PassthroughConverter();
        this.inPreferences = inPreferences ?? {};
    }
    async getRepresentation(identifier, preferences, conditions) {
        const representation = await super.getRepresentation(identifier, preferences, conditions);
        return this.outConverter.handleSafe({ identifier, representation, preferences });
    }
    async addResource(identifier, representation, conditions) {
        // In case of containers, no content-type is required and the representation is not used.
        if (representation.metadata.contentType) {
            // We can potentially run into problems here if we convert a turtle document where the base IRI is required,
            // since we don't know the resource IRI yet at this point.
            representation = await this.inConverter.handleSafe({ identifier, representation, preferences: this.inPreferences });
        }
        return this.source.addResource(identifier, representation, conditions);
    }
    async setRepresentation(identifier, representation, conditions) {
        // When it is a metadata resource, convert it to Quads as those are expected in the later stores
        if (this.metadataStrategy.isAuxiliaryIdentifier(identifier)) {
            representation = await this.inConverter.handleSafe({ identifier, representation, preferences: { type: { [ContentTypes_1.INTERNAL_QUADS]: 1 } } });
        }
        else if (representation.metadata.contentType) {
            representation = await this.inConverter.handleSafe({ identifier, representation, preferences: this.inPreferences });
        }
        return this.source.setRepresentation(identifier, representation, conditions);
    }
}
exports.RepresentationConvertingStore = RepresentationConvertingStore;
//# sourceMappingURL=RepresentationConvertingStore.js.map