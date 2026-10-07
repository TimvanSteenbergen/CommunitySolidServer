"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieMetadataWriter = void 0;
const cookie_1 = require("cookie");
const n3_1 = require("n3");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const MetadataWriter_1 = require("./MetadataWriter");
/**
 * Generates the necessary `Set-Cookie` header if a cookie value is detected in the metadata.
 * The keys of the input `cookieMap` should be the URIs of the predicates
 * used in the metadata when the object is a cookie value.
 * The value of the map are objects that contain the name of the cookie,
 * and the URI that is used to store the expiration date in the metadata, if any.
 * If no expiration date is found in the metadata, none will be set for the cookie,
 * causing it to be a session cookie.
 */
class CookieMetadataWriter extends MetadataWriter_1.MetadataWriter {
    cookieMap;
    constructor(cookieMap) {
        super();
        this.cookieMap = new Map(Object.entries(cookieMap)
            .map(([uri, { name, expirationUri }]) => [
            n3_1.DataFactory.namedNode(uri),
            {
                name,
                expirationUri: expirationUri ? n3_1.DataFactory.namedNode(expirationUri) : undefined,
            },
        ]));
    }
    async handle(input) {
        const { response, metadata } = input;
        for (const [uri, { name, expirationUri }] of this.cookieMap.entries()) {
            const value = metadata.get(uri)?.value;
            if (value) {
                const expiration = expirationUri && metadata.get(expirationUri)?.value;
                const expires = typeof expiration === 'string' ? new Date(expiration) : undefined;
                // Not setting secure flag since not all tools realize those cookies are also valid for http://localhost.
                // Not setting the httpOnly flag as that would prevent JS API access.
                // SameSite: Lax makes it so the cookie gets sent if the origin is the server,
                // or if the browser navigates there from another site.
                // Setting the path to `/` so it applies to the entire server.
                (0, HeaderUtil_1.addHeader)(response, 'Set-Cookie', (0, cookie_1.serialize)(name, value, { path: '/', sameSite: 'lax', expires }));
            }
        }
    }
}
exports.CookieMetadataWriter = CookieMetadataWriter;
//# sourceMappingURL=CookieMetadataWriter.js.map