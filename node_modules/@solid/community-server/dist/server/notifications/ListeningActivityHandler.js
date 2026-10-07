"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListeningActivityHandler = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const StaticHandler_1 = require("../../util/handlers/StaticHandler");
/**
 * Listens to an {@link ActivityEmitter} and calls the stored {@link NotificationHandler}s in case of an event
 * for every matching notification channel found.
 *
 * Takes the `rate` feature into account so only channels that want a new notification will receive one.
 *
 * Extends {@link StaticHandler} so it can be more easily injected into a Components.js configuration.
 * No class takes this one as input, so to make sure Components.js instantiates it,
 * it needs to be added somewhere where its presence has no impact, such as the list of initializers.
 */
class ListeningActivityHandler extends StaticHandler_1.StaticHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    handler;
    constructor(storage, emitter, handler) {
        super();
        this.storage = storage;
        this.handler = handler;
        emitter.on('changed', (topic, activity, metadata) => {
            this.emit(topic, activity, metadata).catch((error) => {
                this.logger.error(`Something went wrong emitting notifications: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            });
        });
    }
    async emit(topic, activity, metadata) {
        const channelIds = await this.storage.getAll(topic);
        for (const id of channelIds) {
            const channel = await this.storage.get(id);
            if (!channel) {
                // Notification channel has expired
                continue;
            }
            // Don't emit if the previous notification was too recent according to the requested rate
            if (channel.lastEmit && channel.rate && channel.rate > Date.now() - channel.lastEmit) {
                continue;
            }
            // Don't emit if we have not yet reached the requested starting time
            if (channel.startAt && channel.startAt > Date.now()) {
                continue;
            }
            // No need to wait on this to resolve before going to the next channel.
            // Prevent failed notification from blocking other notifications.
            this.handler.handleSafe({ channel, activity, topic, metadata })
                .then(async () => {
                // Update the `lastEmit` value if the channel has a rate limit
                if (channel.rate) {
                    channel.lastEmit = Date.now();
                    return this.storage.update(channel);
                }
            })
                .catch((error) => {
                this.logger.error(`Error trying to handle notification for ${id}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            });
        }
    }
}
exports.ListeningActivityHandler = ListeningActivityHandler;
//# sourceMappingURL=ListeningActivityHandler.js.map