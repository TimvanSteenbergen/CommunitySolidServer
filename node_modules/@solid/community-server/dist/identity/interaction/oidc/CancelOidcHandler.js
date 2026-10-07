"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelOidcHandler = void 0;
const FoundHttpError_1 = require("../../../util/errors/FoundHttpError");
const InteractionUtil_1 = require("../InteractionUtil");
const JsonInteractionHandler_1 = require("../JsonInteractionHandler");
/**
 * Cancel an active OIDC interaction.
 */
class CancelOidcHandler extends JsonInteractionHandler_1.JsonInteractionHandler {
    async handle({ oidcInteraction }) {
        (0, InteractionUtil_1.assertOidcInteraction)(oidcInteraction);
        const error = {
            error: 'access_denied',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            error_description: 'User cancelled the interaction.',
        };
        const location = await (0, InteractionUtil_1.finishInteraction)(oidcInteraction, error, false);
        throw new FoundHttpError_1.FoundHttpError(location);
    }
}
exports.CancelOidcHandler = CancelOidcHandler;
//# sourceMappingURL=CancelOidcHandler.js.map