"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountPromptFactory = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const IdentityUtil_1 = require("../IdentityUtil");
const InteractionUtil_1 = require("../interaction/InteractionUtil");
const PromptFactory_1 = require("./PromptFactory");
/**
 * Creates the prompt necessary to ensure a user is logged in with their account when doing an OIDC interaction.
 * This is done by checking the presence of the account-related cookie.
 *
 * Adds a Check to the login policy that verifies if the stored accountId, which corresponds to the chosen WebID,
 * belongs to the currently logged in account.
 */
class AccountPromptFactory extends PromptFactory_1.PromptFactory {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    webIdStore;
    cookieStore;
    cookieName;
    constructor(webIdStore, cookieStore, cookieName) {
        super();
        this.webIdStore = webIdStore;
        this.cookieStore = cookieStore;
        this.cookieName = cookieName;
    }
    async handle(policy) {
        const { interactionPolicy: ip } = await (0, IdentityUtil_1.importOidcProvider)();
        this.addAccountPrompt(policy, ip);
        this.addWebIdVerificationPrompt(policy, ip);
    }
    addAccountPrompt(policy, ip) {
        const check = new ip.Check('no_account', 'An account cookie is required.', async (ctx) => {
            const cookie = ctx.cookies.get(this.cookieName);
            let accountId;
            if (cookie) {
                accountId = await this.cookieStore.get(cookie);
                // This is an ugly way to pass a value to the other prompts/checks,
                // but the oidc-provider library does similar things internally.
                ctx.oidc.internalAccountId = accountId;
            }
            this.logger.debug(`Found account cookie ${cookie} and accountID ${accountId}`);
            // Check needs to return true if the prompt has to trigger
            return !accountId;
        });
        const accountPrompt = new ip.Prompt({ name: InteractionUtil_1.ACCOUNT_PROMPT, requestable: true }, check);
        policy.add(accountPrompt, 0);
    }
    addWebIdVerificationPrompt(policy, ip) {
        const check = new ip.Check('no_webid_ownserhip', 'The stored WebID does not belong to the account.', async (ctx) => {
            const webId = ctx.oidc.session?.accountId;
            if (!webId) {
                return false;
            }
            const accountId = ctx.oidc.internalAccountId;
            if (!accountId) {
                this.logger.error(`Missing 'internalAccountId' value in OIDC context`);
                return false;
            }
            const isLinked = await this.webIdStore.isLinked(webId, accountId);
            this.logger.debug(`Session has WebID ${webId}, which ${isLinked ? 'belongs' : 'does not belong'} to the authenticated account`);
            return !isLinked;
        });
        const loginPrompt = policy.get('login');
        if (!loginPrompt) {
            throw new InternalServerError_1.InternalServerError('Missing default login policy');
        }
        loginPrompt.checks.add(check);
    }
}
exports.AccountPromptFactory = AccountPromptFactory;
//# sourceMappingURL=AccountPromptFactory.js.map