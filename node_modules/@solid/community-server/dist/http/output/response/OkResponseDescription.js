"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OkResponseDescription = void 0;
const Vocabularies_1 = require("../../../util/Vocabularies");
const ResponseDescription_1 = require("./ResponseDescription");
/**
 * Corresponds to a 200 or 206 response, containing relevant metadata and potentially data.
 * A 206 will be returned if range metadata is found in the metadata object.
 */
class OkResponseDescription extends ResponseDescription_1.ResponseDescription {
    /**
     * @param metadata - Metadata concerning the response.
     * @param data - Potential data. @ignored
     */
    constructor(metadata, data) {
        super(metadata.has(Vocabularies_1.SOLID_HTTP.terms.unit) ? 206 : 200, metadata, data);
    }
}
exports.OkResponseDescription = OkResponseDescription;
//# sourceMappingURL=OkResponseDescription.js.map