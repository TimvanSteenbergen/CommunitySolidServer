"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsecureWebSocketsProtocol = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const WebSocketHandler_1 = require("../server/WebSocketHandler");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const NotImplementedHttpError_1 = require("../util/errors/NotImplementedHttpError");
const GenericEventEmitter_1 = require("../util/GenericEventEmitter");
const HeaderUtil_1 = require("../util/HeaderUtil");
const StringUtil_1 = require("../util/StringUtil");
const VERSION = 'solid-0.1';
// eslint-disable-next-line @typescript-eslint/naming-convention
const WebSocketListenerEmitter = (0, GenericEventEmitter_1.createGenericEventEmitterClass)();
/**
 * Implementation of Solid WebSockets API Spec solid-0.1
 * at https://github.com/solid/solid-spec/blob/master/api-websockets.md
 */
class WebSocketListener extends WebSocketListenerEmitter {
    host = '';
    protocol = '';
    socket;
    subscribedPaths = new Set();
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(socket) {
        super();
        this.socket = socket;
        socket.addListener('error', () => this.stop());
        socket.addListener('close', () => this.stop());
        socket.addListener('message', (message) => this.onMessage(message));
    }
    start({ headers, socket }) {
        // Greet the client
        this.sendMessage('protocol', VERSION);
        // Verify the WebSocket protocol version
        const protocolHeader = headers['sec-websocket-protocol'];
        if (protocolHeader) {
            const supportedProtocols = (0, StringUtil_1.splitCommaSeparated)(protocolHeader);
            if (!supportedProtocols.includes(VERSION)) {
                this.sendMessage('error', `Client does not support protocol ${VERSION}`);
                this.stop();
            }
        }
        else {
            this.sendMessage('warning', `Missing Sec-WebSocket-Protocol header, expected value '${VERSION}'`);
        }
        // Store the HTTP host and protocol
        const forwarded = (0, HeaderUtil_1.parseForwarded)(headers);
        this.host = forwarded.host ?? headers.host ?? 'localhost';
        this.protocol = forwarded.proto === 'https' || socket.encrypted ? 'https:' : 'http:';
    }
    stop() {
        try {
            this.socket.close();
        }
        catch {
            // Ignore
        }
        this.subscribedPaths.clear();
        this.socket.removeAllListeners();
        this.emit('closed');
    }
    onResourceChanged({ path }) {
        if (this.subscribedPaths.has(path)) {
            this.sendMessage('pub', path);
        }
    }
    onMessage(message) {
        // Parse the message
        const match = /^(\w+)\s+(\S.+)$/u.exec(message);
        if (!match) {
            this.sendMessage('warning', `Unrecognized message format: ${message}`);
            return;
        }
        // Process the message
        const [, type, value] = match;
        switch (type) {
            case 'sub':
                this.subscribe(value);
                break;
            default:
                this.sendMessage('warning', `Unrecognized message type: ${type}`);
        }
    }
    subscribe(path) {
        try {
            // Resolve and verify the URL
            const resolved = new URL(path, `${this.protocol}${this.host}`);
            if (resolved.host !== this.host) {
                throw new Error(`Mismatched host: expected ${this.host} but got ${resolved.host}`);
            }
            if (resolved.protocol !== this.protocol) {
                throw new Error(`Mismatched protocol: expected ${this.protocol} but got ${resolved.protocol}`);
            }
            // Subscribe to the URL
            const url = resolved.href;
            this.subscribedPaths.add(url);
            this.sendMessage('ack', url);
            this.logger.debug(`WebSocket subscribed to changes on ${url}`);
        }
        catch (error) {
            // Report errors to the socket
            const errorText = (0, ErrorUtil_1.createErrorMessage)(error);
            this.sendMessage('error', errorText);
            this.logger.warn(`WebSocket could not subscribe to ${path}: ${errorText}`);
        }
    }
    sendMessage(type, value) {
        this.socket.send(`${type} ${value}`);
    }
}
/**
 * Provides live update functionality following
 * the Solid WebSockets API Spec solid-0.1.
 *
 * The `baseUrl` parameter should be the same one that is used to advertise with the Updates-Via header.
 */
class UnsecureWebSocketsProtocol extends WebSocketHandler_1.WebSocketHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    path;
    listeners = new Set();
    constructor(source, baseUrl) {
        super();
        this.logger.warn('The chosen configuration includes Solid WebSockets API 0.1, which is unauthenticated.');
        this.logger.warn('This component will be removed from default configurations in future versions.');
        this.path = new URL(baseUrl).pathname;
        source.on('changed', (changed) => this.onResourceChanged(changed));
    }
    async canHandle({ upgradeRequest }) {
        if (upgradeRequest.url !== this.path) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Only WebSocket requests to ${this.path} are supported.`);
        }
    }
    async handle({ webSocket, upgradeRequest }) {
        const listener = new WebSocketListener(webSocket);
        this.listeners.add(listener);
        this.logger.info(`New WebSocket added, ${this.listeners.size} in total`);
        listener.on('closed', () => {
            this.listeners.delete(listener);
            this.logger.info(`WebSocket closed, ${this.listeners.size} remaining`);
        });
        listener.start(upgradeRequest);
    }
    onResourceChanged(changed) {
        for (const listener of this.listeners) {
            listener.onResourceChanged(changed);
        }
    }
}
exports.UnsecureWebSocketsProtocol = UnsecureWebSocketsProtocol;
//# sourceMappingURL=UnsecureWebSocketsProtocol.js.map