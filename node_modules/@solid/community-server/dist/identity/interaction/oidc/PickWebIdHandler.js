"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickWebIdHandler = void 0;
const yup_1 = require("yup");
const LogUtil_1 = require("../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const FoundHttpError_1 = require("../../../util/errors/FoundHttpError");
const AccountUtil_1 = require("../account/util/AccountUtil");
const InteractionUtil_1 = require("../InteractionUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
const YupUtil_1 = require("../YupUtil");
const inSchema = (0, yup_1.object)({
    webId: (0, yup_1.string)().trim().required(),
    remember: (0, yup_1.boolean)().default(false),
});
/**
 * Allows users to choose which WebID they want to authenticate as during an OIDC interaction.
 *
 * One of the main reason picking a WebID is a separate class/request from consenting to the OIDC interaction,
 * is because the OIDC-provider will only give the information we need for consent
 * once we have added an accountId to the OIDC interaction, which we do in this class.
 * The library also really wants to use that accountId as the value that you use for generating the tokens,
 * meaning we can't just use another value there, so we need to assign the WebID to it,
 * unless we use a hacky workaround.
 */
class PickWebIdHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    webIdStore;
    providerFactory;
    constructor(webIdStore, providerFactory) {
        super();
        this.webIdStore = webIdStore;
        this.providerFactory = providerFactory;
    }
    async getView({ accountId }) {
        (0, AccountUtil_1.assertAccountId)(accountId);
        const description = (0, YupUtil_1.parseSchema)(inSchema);
        const webIds = (await this.webIdStore.findLinks(accountId)).map((link) => link.webId);
        return { json: { ...description, webIds } };
    }
    async handle({ oidcInteraction, accountId, json }) {
        (0, InteractionUtil_1.assertOidcInteraction)(oidcInteraction);
        (0, AccountUtil_1.assertAccountId)(accountId);
        const { webId, remember } = await (0, YupUtil_1.validateWithError)(inSchema, json);
        if (!await this.webIdStore.isLinked(webId, accountId)) {
            this.logger.warn(`Trying to pick WebID ${webId} which does not belong to account ${accountId}`);
            throw new BadRequestHttpError_1.BadRequestHttpError('WebID does not belong to this account.');
        }
        // We need to explicitly forget the WebID from the session or the library won't allow us to update the value
        await (0, InteractionUtil_1.forgetWebId)(await this.providerFactory.getProvider(), oidcInteraction);
        // Update the interaction to get the redirect URL
        const login = {
            // Note that `accountId` here is unrelated to our user accounts but is part of the OIDC library
            accountId: webId,
            remember,
        };
        const location = await (0, InteractionUtil_1.finishInteraction)(oidcInteraction, { login }, true);
        throw new FoundHttpError_1.FoundHttpError(location);
    }
}
exports.PickWebIdHandler = PickWebIdHandler;
//# sourceMappingURL=PickWebIdHandler.js.map