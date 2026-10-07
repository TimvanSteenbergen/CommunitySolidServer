"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUrlHandler = void 0;
const VariableHandler_1 = require("./VariableHandler");
const Variables_1 = require("./Variables");
/**
 * Adds the pod identifier as base url variable to the agent.
 * This allows for config templates that require a value for TEMPLATE_BASE_URL_URN,
 * which should equal the pod identifier.
 */
class BaseUrlHandler extends VariableHandler_1.VariableHandler {
    async handle({ identifier, settings }) {
        settings[Variables_1.TEMPLATE_VARIABLE.baseUrl] = identifier.path;
    }
}
exports.BaseUrlHandler = BaseUrlHandler;
//# sourceMappingURL=BaseUrlHandler.js.map