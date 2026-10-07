"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket2023Emitter = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const StreamUtil_1 = require("../../../util/StreamUtil");
const NotificationEmitter_1 = require("../NotificationEmitter");
/**
 * Emits notifications on WebSocketChannel2023 subscription.
 * Uses the WebSockets found in the provided map.
 * The key should be the identifier of the matching channel.
 */
class WebSocket2023Emitter extends NotificationEmitter_1.NotificationEmitter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    socketMap;
    constructor(socketMap) {
        super();
        this.socketMap = socketMap;
    }
    async handle({ channel, representation }) {
        // Called as a NotificationEmitter: emit the notification
        const webSockets = this.socketMap.get(channel.id);
        if (webSockets) {
            const data = await (0, StreamUtil_1.readableToString)(representation.data);
            for (const webSocket of webSockets) {
                webSocket.send(data);
            }
        }
        else {
            representation.data.destroy();
        }
    }
}
exports.WebSocket2023Emitter = WebSocket2023Emitter;
//# sourceMappingURL=WebSocket2023Emitter.js.map