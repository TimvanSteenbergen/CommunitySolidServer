"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterMetadataDataAccessor = void 0;
const PassthroughDataAccessor_1 = require("./PassthroughDataAccessor");
/**
 * A FilterMetadataDataAccessor wraps a DataAccessor such that specific metadata properties
 * can be filtered before passing on the call to the wrapped DataAccessor.
 */
class FilterMetadataDataAccessor extends PassthroughDataAccessor_1.PassthroughDataAccessor {
    filters;
    /**
     * Construct an instance of FilterMetadataDataAccessor.
     *
     * @param accessor - The DataAccessor to wrap.
     * @param filters - Filter patterns to be used for metadata removal.
     */
    constructor(accessor, filters) {
        super(accessor);
        this.filters = filters;
    }
    async writeDocument(identifier, data, metadata) {
        this.applyFilters(metadata);
        return this.accessor.writeDocument(identifier, data, metadata);
    }
    async writeContainer(identifier, metadata) {
        this.applyFilters(metadata);
        return this.accessor.writeContainer(identifier, metadata);
    }
    /**
     * Utility function that removes metadata entries,
     * based on the configured filter patterns.
     *
     * @param metadata - Metadata for the request.
     */
    applyFilters(metadata) {
        for (const filter of this.filters) {
            // Find the matching quads.
            const matchingQuads = metadata.quads(filter.subject, filter.predicate, filter.object);
            // Remove the resulset.
            metadata.removeQuads(matchingQuads);
        }
    }
}
exports.FilterMetadataDataAccessor = FilterMetadataDataAccessor;
//# sourceMappingURL=FilterMetadataDataAccessor.js.map