"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateHandler = void 0;
const AsyncHandler_1 = require("../../util/handlers/AsyncHandler");
/**
 * Handles the `state` feature of notifications.
 * Every implementation of a specific notification channel type should make sure an instance of this class
 * gets called when a `state` notification can be sent out.
 *
 * Implementations of this class should handle all channels and filter out those that need a `state` notification.
 */
class StateHandler extends AsyncHandler_1.AsyncHandler {
}
exports.StateHandler = StateHandler;
//# sourceMappingURL=StateHandler.js.map