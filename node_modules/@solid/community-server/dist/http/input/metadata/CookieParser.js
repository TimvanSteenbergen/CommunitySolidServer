"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieParser = void 0;
const cookie_1 = require("cookie");
const n3_1 = require("n3");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataParser_1 = require("./MetadataParser");
var namedNode = n3_1.DataFactory.namedNode;
/**
 * Parses the cookie header and stores their values as metadata.
 * The keys of the input `cookieMap` should be the cookie names,
 * and the values the corresponding predicate that should be used to store the value in the metadata.
 * The values of the cookies will be used as objects in the generated triples
 */
class CookieParser extends MetadataParser_1.MetadataParser {
    cookieMap;
    constructor(cookieMap) {
        super();
        this.cookieMap = Object.fromEntries(Object.entries(cookieMap).map(([name, uri]) => [name, namedNode(uri)]));
    }
    async handle(input) {
        const cookies = (0, cookie_1.parse)(input.request.headers.cookie ?? '');
        for (const [name, uri] of Object.entries(this.cookieMap)) {
            const value = cookies[name];
            if (value) {
                // This metadata should not be stored
                input.metadata.add(uri, value, Vocabularies_1.SOLID_META.ResponseMetadata);
            }
        }
    }
}
exports.CookieParser = CookieParser;
//# sourceMappingURL=CookieParser.js.map