"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServerConfigurator = void 0;
const ws_1 = require("ws");
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const GuardedStream_1 = require("../util/GuardedStream");
const ServerConfigurator_1 = require("./ServerConfigurator");
/**
 * {@link ServerConfigurator} that adds WebSocket functionality to an existing {@link Server}.
 *
 * Listens for WebSocket requests and sends them to its handler.
 */
class WebSocketServerConfigurator extends ServerConfigurator_1.ServerConfigurator {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    handler;
    constructor(handler) {
        super();
        this.handler = handler;
    }
    async handle(server) {
        // Create WebSocket server
        const webSocketServer = new ws_1.WebSocketServer({ noServer: true });
        server.on('upgrade', (upgradeRequest, socket, head) => {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            webSocketServer.handleUpgrade(upgradeRequest, socket, head, async (webSocket) => {
                try {
                    await this.handler.handleSafe({ upgradeRequest: (0, GuardedStream_1.guardStream)(upgradeRequest), webSocket });
                }
                catch (error) {
                    this.logger.error(`Something went wrong handling a WebSocket connection: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
                    webSocket.send(`There was an error opening this WebSocket: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
                    webSocket.close();
                }
            });
        });
    }
}
exports.WebSocketServerConfigurator = WebSocketServerConfigurator;
//# sourceMappingURL=WebSocketServerConfigurator.js.map