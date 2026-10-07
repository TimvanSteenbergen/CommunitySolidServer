"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedNotificationHandler = void 0;
const NotificationHandler_1 = require("./NotificationHandler");
/**
 * Generates, serializes and emits a {@link Notification} using a {@link NotificationGenerator},
 * {@link NotificationSerializer} and {@link NotificationEmitter}.
 *
 * Will not emit an event when it has the same state as the notification channel.
 */
class ComposedNotificationHandler extends NotificationHandler_1.NotificationHandler {
    generator;
    serializer;
    emitter;
    eTagHandler;
    constructor(args) {
        super();
        this.generator = args.generator;
        this.serializer = args.serializer;
        this.emitter = args.emitter;
        this.eTagHandler = args.eTagHandler;
    }
    async canHandle(input) {
        await this.generator.canHandle(input);
    }
    async handle(input) {
        const notification = await this.generator.handle(input);
        const { state } = input.channel;
        // In case the state matches there is no need to send the notification
        if (typeof state === 'string' && notification.state &&
            this.eTagHandler.sameResourceState(state, notification.state)) {
            return;
        }
        const representation = await this.serializer.handleSafe({ channel: input.channel, notification });
        await this.emitter.handleSafe({ channel: input.channel, representation });
    }
}
exports.ComposedNotificationHandler = ComposedNotificationHandler;
//# sourceMappingURL=ComposedNotificationHandler.js.map