"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicConditions = void 0;
const Vocabularies_1 = require("../../util/Vocabularies");
/**
 * Stores all the relevant Conditions values and matches them based on RFC7232.
 */
class BasicConditions {
    eTagHandler;
    matchesETag;
    notMatchesETag;
    modifiedSince;
    unmodifiedSince;
    constructor(eTagHandler, options) {
        this.eTagHandler = eTagHandler;
        this.matchesETag = options.matchesETag;
        this.notMatchesETag = options.notMatchesETag;
        this.modifiedSince = options.modifiedSince;
        this.unmodifiedSince = options.unmodifiedSince;
    }
    matchesMetadata(metadata, strict) {
        if (!metadata) {
            // RFC7232: ...If-Match... If the field-value is "*", the condition is false if the origin server
            // does not have a current representation for the target resource.
            return !this.matchesETag?.includes('*');
        }
        // RFC7232: ...If-None-Match... If the field-value is "*", the condition is false if the origin server
        // has a current representation for the target resource.
        if (this.notMatchesETag?.includes('*')) {
            return false;
        }
        const eTagMatches = (tag) => this.eTagHandler.matchesETag(metadata, tag, Boolean(strict));
        if (this.matchesETag && !this.matchesETag.includes('*') && !this.matchesETag.some(eTagMatches)) {
            return false;
        }
        if (this.notMatchesETag?.some(eTagMatches)) {
            return false;
        }
        // In practice, this will only be undefined on a backend
        // that doesn't store the modified date.
        const modified = metadata.get(Vocabularies_1.DC.terms.modified);
        if (modified) {
            const modifiedDate = new Date(modified.value);
            // The If-Modified-Since and If-Unmodified-Since values do not include milliseconds
            modifiedDate.setMilliseconds(0);
            if (this.modifiedSince && modifiedDate <= this.modifiedSince) {
                return false;
            }
            if (this.unmodifiedSince && modifiedDate > this.unmodifiedSince) {
                return false;
            }
        }
        return true;
    }
}
exports.BasicConditions = BasicConditions;
//# sourceMappingURL=BasicConditions.js.map