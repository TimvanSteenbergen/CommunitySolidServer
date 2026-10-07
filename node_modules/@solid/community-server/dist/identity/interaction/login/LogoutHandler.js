"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutHandler = void 0;
const RepresentationMetadata_1 = require("../../../http/representation/RepresentationMetadata");
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const Vocabularies_1 = require("../../../util/Vocabularies");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Responsible for logging a user out.
 * In practice this means making sure the cookie is no longer valid.
 */
class LogoutHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    cookieStore;
    constructor(cookieStore) {
        super();
        this.cookieStore = cookieStore;
    }
    async handle(input) {
        const { metadata, accountId, target } = input;
        const cookie = metadata.get(Vocabularies_1.SOLID_HTTP.terms.accountCookie)?.value;
        if (cookie) {
            // Make sure the cookie belongs to the logged-in user.
            const foundId = await this.cookieStore.get(cookie);
            if (foundId !== accountId) {
                throw new BadRequestHttpError_1.BadRequestHttpError('Invalid cookie.');
            }
            await this.cookieStore.delete(cookie);
            // Setting the expiration time of a cookie to somewhere in the past causes browsers to delete that cookie
            const outputMetadata = new RepresentationMetadata_1.RepresentationMetadata(target);
            outputMetadata.set(Vocabularies_1.SOLID_HTTP.terms.accountCookie, cookie);
            outputMetadata.set(Vocabularies_1.SOLID_HTTP.terms.accountCookieExpiration, new Date(0).toISOString());
            return { json: {}, metadata: outputMetadata };
        }
        return { json: {} };
    }
}
exports.LogoutHandler = LogoutHandler;
//# sourceMappingURL=LogoutHandler.js.map