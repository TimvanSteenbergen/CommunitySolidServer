"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableHandler = void 0;
const AsyncHandler_1 = require("../../../util/handlers/AsyncHandler");
/**
 * Updates the variables stored in the given agent.
 * Can be used to set variables that are required for the Components.js instantiation
 * but which should not be provided by the request.
 * E.g.: The exact file path (when required) should be determined by the server to prevent abuse.
 */
class VariableHandler extends AsyncHandler_1.AsyncHandler {
}
exports.VariableHandler = VariableHandler;
//# sourceMappingURL=VariableHandler.js.map