"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSerializer = void 0;
const AsyncHandler_1 = require("../../../util/handlers/AsyncHandler");
/**
 * Converts a {@link Notification} into a {@link Representation} that can be transmitted.
 *
 * This is a separate class between a generator and emitter,
 * so that a specific notification channel type can add extra metadata to the Representation if needed.
 */
class NotificationSerializer extends AsyncHandler_1.AsyncHandler {
}
exports.NotificationSerializer = NotificationSerializer;
//# sourceMappingURL=NotificationSerializer.js.map