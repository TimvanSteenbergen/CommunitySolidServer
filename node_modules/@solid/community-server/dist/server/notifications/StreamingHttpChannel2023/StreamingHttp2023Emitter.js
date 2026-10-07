"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingHttp2023Emitter = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const AsyncHandler_1 = require("../../../util/handlers/AsyncHandler");
const StreamUtil_1 = require("../../../util/StreamUtil");
/**
 * Emits notifications on StreamingHTTPChannel2023 streams.
 * Uses the response streams found in the provided map.
 * The key should be the identifier of the topic resource.
 */
class StreamingHttp2023Emitter extends AsyncHandler_1.AsyncHandler {
    streamMap;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(streamMap) {
        super();
        this.streamMap = streamMap;
    }
    async handle({ channel, representation }) {
        // Called as a NotificationEmitter: emit the notification
        const streams = this.streamMap.get(channel.topic);
        if (streams) {
            // Ensure that the whole notification gets sent in a single chunk
            const chunk = await (0, StreamUtil_1.readableToString)(representation.data);
            for (const stream of streams) {
                stream.write(chunk);
            }
        }
        else {
            representation.data.destroy();
        }
    }
}
exports.StreamingHttp2023Emitter = StreamingHttp2023Emitter;
//# sourceMappingURL=StreamingHttp2023Emitter.js.map