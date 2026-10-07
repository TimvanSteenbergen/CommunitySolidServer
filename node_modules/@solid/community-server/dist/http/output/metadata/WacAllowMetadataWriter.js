"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WacAllowMetadataWriter = void 0;
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * Add the necessary WAC-Allow header values.
 * Solid, §10.1: "Servers exposing client’s access privileges on a resource URL MUST advertise
 * by including the WAC-Allow HTTP header in the response of HTTP HEAD and GET requests."
 * https://solid.github.io/specification/protocol#web-access-control
 */
class WacAllowMetadataWriter extends MetadataWriter_1.MetadataWriter {
    async handle(input) {
        let userModes = new Set(input.metadata.getAll(Vocabularies_1.AUTH.terms.userMode).map(this.aclToPermission));
        const publicModes = new Set(input.metadata.getAll(Vocabularies_1.AUTH.terms.publicMode).map(this.aclToPermission));
        // Public access implies user access
        userModes = new Set([...userModes, ...publicModes]);
        const headerStrings = [];
        if (userModes.size > 0) {
            headerStrings.push(this.createAccessParam('user', userModes));
        }
        if (publicModes.size > 0) {
            headerStrings.push(this.createAccessParam('public', publicModes));
        }
        // Only add the header if there are permissions to show
        if (headerStrings.length > 0) {
            (0, HeaderUtil_1.addHeader)(input.response, 'WAC-Allow', headerStrings.join(','));
        }
    }
    aclToPermission(aclTerm) {
        return aclTerm.value.slice(Vocabularies_1.ACL.namespace.length).toLowerCase();
    }
    createAccessParam(name, modes) {
        // Sort entries to have consistent output
        return `${name}="${[...modes].sort((left, right) => left.localeCompare(right)).join(' ')}"`;
    }
}
exports.WacAllowMetadataWriter = WacAllowMetadataWriter;
//# sourceMappingURL=WacAllowMetadataWriter.js.map