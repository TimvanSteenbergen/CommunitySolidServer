"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieInteractionHandler = void 0;
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const Vocabularies_1 = require("../../util/Vocabularies");
const AccountStore_1 = require("./account/util/AccountStore");
const JsonInteractionHandler_1 = require("./JsonInteractionHandler");
/**
 * Handles all the necessary steps for having cookies.
 * Refreshes the cookie expiration if there was a successful account interaction.
 * Adds the cookie and cookie expiration data to the output metadata,
 * unless it is already present in that metadata.
 * Checks the account settings to see if the cookie needs to be remembered.
 */
class CookieInteractionHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    source;
    accountStore;
    cookieStore;
    constructor(source, accountStore, cookieStore) {
        super();
        this.source = source;
        this.accountStore = accountStore;
        this.cookieStore = cookieStore;
    }
    async canHandle(input) {
        return this.source.canHandle(input);
    }
    async handle(input) {
        const output = await this.source.handle(input);
        let { metadata: outputMetadata } = output;
        // The cookie could be new, in the output, or the one received in the input if no new cookie is made
        const cookie = outputMetadata?.get(Vocabularies_1.SOLID_HTTP.terms.accountCookie)?.value ??
            input.metadata.get(Vocabularies_1.SOLID_HTTP.terms.accountCookie)?.value;
        // Only update the expiration if it wasn't set by the source handler,
        // as that might have a specific reason, such as logging out.
        if (!cookie || outputMetadata?.has(Vocabularies_1.SOLID_HTTP.terms.accountCookieExpiration)) {
            return output;
        }
        // Not reusing the account ID from the input,
        // as that could potentially belong to a different account if this is a new login action.
        const accountId = await this.cookieStore.get(cookie);
        // Only refresh the cookie if it points to an account that exists and wants to be remembered
        if (!accountId) {
            return output;
        }
        const setting = await this.accountStore.getSetting(accountId, AccountStore_1.ACCOUNT_SETTINGS_REMEMBER_LOGIN);
        if (!setting) {
            return output;
        }
        // Refresh the cookie, could be undefined if it was deleted by the operation
        const expiration = await this.cookieStore.refresh(cookie);
        if (expiration) {
            outputMetadata = outputMetadata ?? new RepresentationMetadata_1.RepresentationMetadata(input.target);
            outputMetadata.set(Vocabularies_1.SOLID_HTTP.terms.accountCookie, cookie);
            outputMetadata.set(Vocabularies_1.SOLID_HTTP.terms.accountCookieExpiration, expiration.toISOString());
            output.metadata = outputMetadata;
        }
        return output;
    }
}
exports.CookieInteractionHandler = CookieInteractionHandler;
//# sourceMappingURL=CookieInteractionHandler.js.map