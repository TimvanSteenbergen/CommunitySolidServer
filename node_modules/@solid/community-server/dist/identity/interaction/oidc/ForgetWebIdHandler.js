"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetWebIdHandler = void 0;
const FoundHttpError_1 = require("../../../util/errors/FoundHttpError");
const InteractionUtil_1 = require("../InteractionUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Forgets the chosen WebID in an OIDC interaction,
 * causing the next policy trigger to be one where a new WebID has to be chosen.
 */
class ForgetWebIdHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    providerFactory;
    constructor(providerFactory) {
        super();
        this.providerFactory = providerFactory;
    }
    async handle({ oidcInteraction }) {
        (0, InteractionUtil_1.assertOidcInteraction)(oidcInteraction);
        await (0, InteractionUtil_1.forgetWebId)(await this.providerFactory.getProvider(), oidcInteraction);
        // Finish the interaction so the policies get checked again
        const location = await (0, InteractionUtil_1.finishInteraction)(oidcInteraction, {}, false);
        throw new FoundHttpError_1.FoundHttpError(location);
    }
}
exports.ForgetWebIdHandler = ForgetWebIdHandler;
//# sourceMappingURL=ForgetWebIdHandler.js.map