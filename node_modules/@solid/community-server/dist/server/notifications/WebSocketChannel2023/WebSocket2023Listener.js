"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket2023Listener = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const WebSocketHandler_1 = require("../../WebSocketHandler");
const WebSocket2023Util_1 = require("./WebSocket2023Util");
/**
 * Listens for WebSocket connections and verifies whether they are valid WebSocketChannel2023 connections,
 * in which case its {@link WebSocket2023Handler} will be alerted.
 */
class WebSocket2023Listener extends WebSocketHandler_1.WebSocketHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    handler;
    baseUrl;
    constructor(storage, handler, baseUrl) {
        super();
        this.storage = storage;
        this.handler = handler;
        this.baseUrl = baseUrl;
    }
    async canHandle({ upgradeRequest }) {
        const id = (0, WebSocket2023Util_1.parseWebSocketRequest)(this.baseUrl, upgradeRequest);
        const channel = await this.storage.get(id);
        if (!channel) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Unknown or expired WebSocket channel ${id}`);
        }
    }
    async handle({ webSocket, upgradeRequest }) {
        const id = (0, WebSocket2023Util_1.parseWebSocketRequest)(this.baseUrl, upgradeRequest);
        const channel = (await this.storage.get(id));
        this.logger.info(`Accepted WebSocket connection listening to changes on ${channel.topic}`);
        await this.handler.handleSafe({ channel, webSocket });
    }
}
exports.WebSocket2023Listener = WebSocket2023Listener;
//# sourceMappingURL=WebSocket2023Listener.js.map