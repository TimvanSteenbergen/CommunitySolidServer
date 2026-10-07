"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicETagHandler = void 0;
const Vocabularies_1 = require("../../util/Vocabularies");
/**
 * Standard implementation of {@link ETagHandler}.
 * ETags are constructed by combining the last modified date with the content type of the representation.
 */
class BasicETagHandler {
    getETag(metadata) {
        const modified = metadata.get(Vocabularies_1.DC.terms.modified);
        const { contentType } = metadata;
        if (modified && contentType) {
            const date = new Date(modified.value);
            return `"${date.getTime()}-${contentType}"`;
        }
    }
    matchesETag(metadata, eTag, strict) {
        const modified = metadata.get(Vocabularies_1.DC.terms.modified);
        if (!modified) {
            return false;
        }
        const date = new Date(modified.value);
        const { contentType } = metadata;
        // Slicing of the double quotes
        const [eTagTimestamp, eTagContentType] = eTag.slice(1, -1).split('-');
        return eTagTimestamp === `${date.getTime()}` && (!strict || eTagContentType === contentType);
    }
    sameResourceState(eTag1, eTag2) {
        // Since we base the ETag on the last modified date,
        // we know the ETags match as long as the date part is the same.
        return eTag1.split('-')[0] === eTag2.split('-')[0];
    }
}
exports.BasicETagHandler = BasicETagHandler;
//# sourceMappingURL=BasicETagHandler.js.map