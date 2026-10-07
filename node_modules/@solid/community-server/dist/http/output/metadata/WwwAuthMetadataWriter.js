"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WwwAuthMetadataWriter = void 0;
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * Adds the `WWW-Authenticate` header with the injected value in case the response status code is 401.
 */
class WwwAuthMetadataWriter extends MetadataWriter_1.MetadataWriter {
    auth;
    constructor(auth) {
        super();
        this.auth = auth;
    }
    async handle(input) {
        const statusLiteral = input.metadata.get(Vocabularies_1.HTTP.terms.statusCodeNumber);
        if (statusLiteral?.value === '401') {
            (0, HeaderUtil_1.addHeader)(input.response, 'WWW-Authenticate', this.auth);
        }
    }
}
exports.WwwAuthMetadataWriter = WwwAuthMetadataWriter;
//# sourceMappingURL=WwwAuthMetadataWriter.js.map