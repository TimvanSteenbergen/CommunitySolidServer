"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingHttpListeningActivityHandler = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const StaticHandler_1 = require("../../../util/handlers/StaticHandler");
const StreamingHttp2023Util_1 = require("./StreamingHttp2023Util");
/**
 * Listens to an {@link ActivityEmitter} and calls the stored {@link NotificationHandler}s in case of an event
 * for every matching notification channel found.
 *
 * Extends {@link StaticHandler} so it can be more easily injected into a Components.js configuration.
 * No class takes this one as input, so to make sure Components.js instantiates it,
 * it needs to be added somewhere where its presence has no impact, such as the list of initializers.
 */
class StreamingHttpListeningActivityHandler extends StaticHandler_1.StaticHandler {
    streamMap;
    source;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(emitter, streamMap, source) {
        super();
        this.streamMap = streamMap;
        this.source = source;
        emitter.on('changed', (topic, activity, metadata) => {
            if (this.streamMap.has(topic.path)) {
                this.emit(topic, activity, metadata).catch((error) => {
                    this.logger.error(`Error trying to handle notification for ${topic.path}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
                });
            }
        });
    }
    async emit(topic, activity, metadata) {
        const channel = (0, StreamingHttp2023Util_1.generateChannel)(topic);
        return this.source.handleSafe({ channel, activity, topic, metadata });
    }
}
exports.StreamingHttpListeningActivityHandler = StreamingHttpListeningActivityHandler;
//# sourceMappingURL=StreamingHttpListeningActivityHandler.js.map