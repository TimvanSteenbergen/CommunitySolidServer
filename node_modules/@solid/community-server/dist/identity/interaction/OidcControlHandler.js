"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcControlHandler = void 0;
const ControlHandler_1 = require("./ControlHandler");
/**
 * A {@link ControlHandler} that only returns results if there is an active OIDC interaction.
 */
class OidcControlHandler extends ControlHandler_1.ControlHandler {
    async generateControls(input) {
        if (!input.oidcInteraction) {
            return {};
        }
        return super.generateControls(input);
    }
}
exports.OidcControlHandler = OidcControlHandler;
//# sourceMappingURL=OidcControlHandler.js.map