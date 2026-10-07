"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStateHandler = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const StateHandler_1 = require("./StateHandler");
/**
 * Handles the `state` feature by calling a {@link NotificationHandler}
 * in case the {@link NotificationChannel} has a `state` value.
 *
 * Deletes the `state` parameter from the channel afterwards.
 */
class BaseStateHandler extends StateHandler_1.StateHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    handler;
    storage;
    constructor(handler, storage) {
        super();
        this.handler = handler;
        this.storage = storage;
    }
    async handle({ channel }) {
        if (channel.state) {
            const topic = { path: channel.topic };
            try {
                await this.handler.handleSafe({ channel, topic });
                // Remove the state once the relevant notification has been sent
                delete channel.state;
                await this.storage.update(channel);
            }
            catch (error) {
                this.logger.error(`Problem emitting state notification: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            }
        }
    }
}
exports.BaseStateHandler = BaseStateHandler;
//# sourceMappingURL=BaseStateHandler.js.map