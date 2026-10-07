"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInitializer = void 0;
const node_util_1 = require("node:util");
const LogUtil_1 = require("../logging/LogUtil");
const HttpServerFactory_1 = require("../server/HttpServerFactory");
const Initializer_1 = require("./Initializer");
/**
 * Creates and starts an HTTP server.
 */
class ServerInitializer extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    serverFactory;
    port;
    socketPath;
    server;
    constructor(serverFactory, port, socketPath) {
        super();
        this.serverFactory = serverFactory;
        this.port = port;
        this.socketPath = socketPath;
        if (!port && !socketPath) {
            throw new Error('Either Port or Socket arguments must be set');
        }
    }
    async handle() {
        this.server = await this.serverFactory.createServer();
        if (this.socketPath) {
            this.logger.info(`Listening to server at ${this.server.address()}`);
            this.server.listen(this.socketPath);
        }
        else {
            const url = new URL(`http${(0, HttpServerFactory_1.isHttpsServer)(this.server) ? 's' : ''}://localhost:${this.port}/`).href;
            this.logger.info(`Listening to server at ${url}`);
            this.server.listen(this.port);
        }
    }
    async finalize() {
        if (this.server) {
            return (0, node_util_1.promisify)(this.server.close.bind(this.server))();
        }
    }
}
exports.ServerInitializer = ServerInitializer;
//# sourceMappingURL=ServerInitializer.js.map