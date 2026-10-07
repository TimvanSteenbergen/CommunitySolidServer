"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolveLoginHandler = void 0;
const RepresentationMetadata_1 = require("../../../http/representation/RepresentationMetadata");
const LogUtil_1 = require("../../../logging/LogUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const AccountStore_1 = require("../account/util/AccountStore");
const InteractionUtil_1 = require("../InteractionUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * A handler that takes care of all the necessary steps when logging a user in,
 * such as generating a cookie and setting the necessary OIDC information.
 * Classes that resolve login methods should extend this class and implement the `login` method.
 */
class ResolveLoginHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    accountStore;
    cookieStore;
    constructor(accountStore, cookieStore) {
        super();
        this.accountStore = accountStore;
        this.cookieStore = cookieStore;
    }
    async handle(input) {
        const result = await this.login(input);
        const { accountId, remember } = result.json;
        const json = { ...result.json };
        // There is no need to output these fields in the response JSON
        delete json.accountId;
        delete json.remember;
        // The cookie that is used to identify that a user has logged in.
        // Putting it in the metadata, so it can be converted into an HTTP response header.
        // Putting it in the response JSON so users can also use it in an Authorization header.
        const metadata = result.metadata ?? new RepresentationMetadata_1.RepresentationMetadata(input.target);
        json.authorization = await this.cookieStore.generate(accountId);
        metadata.add(Vocabularies_1.SOLID_HTTP.terms.accountCookie, json.authorization);
        // Delete the old cookie if there was one, to prevent unused cookies from being stored.
        // We are not reusing this cookie as it could be associated with a different account.
        const oldCookie = input.metadata.get(Vocabularies_1.SOLID_HTTP.terms.accountCookie)?.value;
        if (oldCookie) {
            this.logger.debug(`Replacing old cookie ${oldCookie} with ${json.cookie}`);
            await this.cookieStore.delete(oldCookie);
        }
        // Update the account settings
        await this.updateRememberSetting(accountId, remember);
        // Not throwing redirect error otherwise the cookie metadata would be lost.
        // See {@link LocationInteractionHandler} why this field is added.
        if (input.oidcInteraction) {
            // Finish the interaction so the policies are checked again, where they will find the new cookie
            json.location = await (0, InteractionUtil_1.finishInteraction)(input.oidcInteraction, {}, true);
        }
        return { json, metadata };
    }
    /**
     * Updates the account setting that determines whether the login status needs to be remembered.
     *
     * @param accountId - ID of the account.
     * @param remember - If the account should be remembered or not. The setting will not be updated if this is undefined.
     */
    async updateRememberSetting(accountId, remember) {
        if (typeof remember === 'boolean') {
            // Store the setting indicating if the user wants the cookie to persist
            await this.accountStore.updateSetting(accountId, AccountStore_1.ACCOUNT_SETTINGS_REMEMBER_LOGIN, remember);
            this.logger.debug(`Updating account remember setting to ${remember}`);
        }
    }
}
exports.ResolveLoginHandler = ResolveLoginHandler;
//# sourceMappingURL=ResolveLoginHandler.js.map