"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationParser = void 0;
const n3_1 = require("n3");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataParser_1 = require("./MetadataParser");
var namedNode = n3_1.DataFactory.namedNode;
/**
 * Parses specific authorization schemes and stores their value as metadata.
 * The keys of the input `authMap` should be the schemes,
 * and the values the corresponding predicate that should be used to store the value in the metadata.
 * The scheme will be sliced off the value, after which it is used as the object in the metadata triple.
 *
 * This should be used for custom authorization schemes,
 * for things like OIDC tokens a {@link CredentialsExtractor} should be used.
 */
class AuthorizationParser extends MetadataParser_1.MetadataParser {
    authMap;
    constructor(authMap) {
        super();
        this.authMap = Object.fromEntries(Object.entries(authMap).map(([scheme, uri]) => [scheme, namedNode(uri)]));
    }
    async handle(input) {
        const authHeader = input.request.headers.authorization;
        if (!authHeader) {
            return;
        }
        for (const [scheme, uri] of Object.entries(this.authMap)) {
            if ((0, HeaderUtil_1.matchesAuthorizationScheme)(scheme, authHeader)) {
                // This metadata should not be stored
                input.metadata.add(uri, authHeader.slice(scheme.length + 1), Vocabularies_1.SOLID_META.ResponseMetadata);
                // There can only be 1 match
                return;
            }
        }
    }
}
exports.AuthorizationParser = AuthorizationParser;
//# sourceMappingURL=AuthorizationParser.js.map