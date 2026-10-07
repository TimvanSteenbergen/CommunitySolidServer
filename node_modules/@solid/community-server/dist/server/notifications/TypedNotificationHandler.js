"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedNotificationHandler = void 0;
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const NotificationHandler_1 = require("./NotificationHandler");
/**
 * A {@link NotificationHandler} that only accepts input for a specific notification channel type.
 */
class TypedNotificationHandler extends NotificationHandler_1.NotificationHandler {
    type;
    source;
    constructor(type, source) {
        super();
        this.type = type;
        this.source = source;
    }
    async canHandle(input) {
        if (input.channel.type !== this.type) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Only ${this.type} notification channels are supported.`);
        }
        await this.source.canHandle(input);
    }
    async handle(input) {
        await this.source.handle(input);
    }
}
exports.TypedNotificationHandler = TypedNotificationHandler;
//# sourceMappingURL=TypedNotificationHandler.js.map