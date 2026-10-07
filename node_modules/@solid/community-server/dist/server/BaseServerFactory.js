"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseServerFactory = void 0;
const node_fs_1 = require("node:fs");
const node_http_1 = require("node:http");
const node_https_1 = require("node:https");
const LogUtil_1 = require("../logging/LogUtil");
/**
 * Creates an HTTP(S) server native Node.js `http`/`https` modules.
 *
 * Will apply a {@link ServerConfigurator} to the server,
 * which should be used to attach listeners.
 */
class BaseServerFactory {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    configurator;
    options;
    constructor(configurator, options) {
        this.configurator = configurator;
        this.options = { https: false, ...options };
    }
    /**
     * Creates an HTTP(S) server.
     */
    async createServer() {
        const options = this.createServerOptions();
        const server = this.options.https ? (0, node_https_1.createServer)(options) : (0, node_http_1.createServer)(options);
        await this.configurator.handleSafe(server);
        return server;
    }
    createServerOptions() {
        const options = { ...this.options };
        for (const id of ['key', 'cert', 'pfx']) {
            const val = options[id];
            if (val) {
                options[id] = (0, node_fs_1.readFileSync)(val, 'utf8');
            }
        }
        return options;
    }
}
exports.BaseServerFactory = BaseServerFactory;
//# sourceMappingURL=BaseServerFactory.js.map