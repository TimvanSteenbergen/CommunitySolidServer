"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentHandler = void 0;
const yup_1 = require("yup");
const FoundHttpError_1 = require("../../../util/errors/FoundHttpError");
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const InteractionUtil_1 = require("../InteractionUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    remember: (0, yup_1.boolean)().default(false),
});
/**
 * Handles the OIDC consent prompts where the user confirms they want to log in for the given client.
 */
class ConsentHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    providerFactory;
    constructor(providerFactory) {
        super();
        this.providerFactory = providerFactory;
    }
    async handle({ oidcInteraction, json }) {
        (0, InteractionUtil_1.assertOidcInteraction)(oidcInteraction);
        const { remember } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        const grant = await this.getGrant(oidcInteraction);
        this.updateGrant(grant, oidcInteraction.prompt.details, remember);
        const location = await this.updateInteraction(oidcInteraction, grant);
        throw new FoundHttpError_1.FoundHttpError(location);
    }
    /**
     * Either returns the grant associated with the given interaction or creates a new one if it does not exist yet.
     */
    async getGrant(oidcInteraction) {
        if (!oidcInteraction.session) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only interactions with a valid session are supported.');
        }
        const { params, session: { accountId }, grantId } = oidcInteraction;
        const provider = await this.providerFactory.getProvider();
        let grant;
        if (grantId) {
            grant = (await provider.Grant.find(grantId));
        }
        else {
            grant = new provider.Grant({
                accountId,
                clientId: params.client_id,
            });
        }
        return grant;
    }
    /**
     * Updates the grant with all the missing scopes and claims requested by the interaction.
     *
     * Will reject the `offline_access` scope if `remember` is false.
     */
    updateGrant(grant, details, remember) {
        // Reject the offline_access scope if the user does not want to be remembered
        if (!remember) {
            grant.rejectOIDCScope('offline_access');
        }
        // Grant all the requested scopes and claims
        if (details.missingOIDCScope) {
            grant.addOIDCScope(details.missingOIDCScope.join(' '));
        }
        if (details.missingOIDCClaims) {
            grant.addOIDCClaims(details.missingOIDCClaims);
        }
        if (details.missingResourceScopes) {
            for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
                grant.addResourceScope(indicator, scopes.join(' '));
            }
        }
    }
    /**
     * Updates the interaction with the new grant and returns the resulting redirect URL.
     */
    async updateInteraction(oidcInteraction, grant) {
        const grantId = await grant.save();
        const consent = {};
        // Only need to update the grantId if it is new
        if (!oidcInteraction.grantId) {
            consent.grantId = grantId;
        }
        return (0, InteractionUtil_1.finishInteraction)(oidcInteraction, { consent }, true);
    }
}
exports.ConsentHandler = ConsentHandler;
//# sourceMappingURL=ConsentHandler.js.map