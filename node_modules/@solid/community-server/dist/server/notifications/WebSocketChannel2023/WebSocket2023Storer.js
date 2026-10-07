"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket2023Storer = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const TimerUtil_1 = require("../../../util/TimerUtil");
const WebSocket2023Handler_1 = require("./WebSocket2023Handler");
/**
 * Keeps track of the WebSockets that were opened for a WebSocketChannel2023 channel.
 * The WebSockets are stored in the map using the identifier of the matching channel.
 *
 * `cleanupTimer` defines in minutes how often the stored WebSockets are closed
 * if their corresponding channel has expired.
 * Defaults to 60 minutes.
 * Open WebSockets will not receive notifications if their channel expired.
 */
class WebSocket2023Storer extends WebSocket2023Handler_1.WebSocket2023Handler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    socketMap;
    constructor(storage, socketMap, cleanupTimer = 60) {
        super();
        this.socketMap = socketMap;
        this.storage = storage;
        const timer = (0, TimerUtil_1.setSafeInterval)(this.logger, 'Failed to remove closed WebSockets', this.closeExpiredSockets.bind(this), cleanupTimer * 60 * 1000);
        timer.unref();
    }
    async handle({ webSocket, channel }) {
        this.socketMap.add(channel.id, webSocket);
        webSocket.on('error', () => this.socketMap.deleteEntry(channel.id, webSocket));
        webSocket.on('close', () => this.socketMap.deleteEntry(channel.id, webSocket));
    }
    /**
     * Close all WebSockets that are attached to a channel that no longer exists.
     */
    async closeExpiredSockets() {
        this.logger.debug('Closing expired WebSockets');
        for (const [id, sockets] of this.socketMap.entrySets()) {
            const result = await this.storage.get(id);
            if (!result) {
                for (const socket of sockets) {
                    // Due to the attached listener, this also deletes the entries in the `socketMap`
                    socket.send(`Notification channel has expired`);
                    socket.close();
                }
            }
        }
        this.logger.debug('Finished closing expired WebSockets');
    }
}
exports.WebSocket2023Storer = WebSocket2023Storer;
//# sourceMappingURL=WebSocket2023Storer.js.map