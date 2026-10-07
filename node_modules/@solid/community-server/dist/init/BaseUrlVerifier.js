"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUrlVerifier = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const Initializer_1 = require("./Initializer");
/**
 * Stores the `baseUrl` value that was used to start the server
 * and warns the user in case it differs from the previous one.
 */
class BaseUrlVerifier extends Initializer_1.Initializer {
    baseUrl;
    storageKey;
    storage;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(baseUrl, storageKey, storage) {
        super();
        this.baseUrl = baseUrl;
        this.storageKey = storageKey;
        this.storage = storage;
    }
    async handle() {
        const previousValue = await this.storage.get(this.storageKey);
        if (previousValue && this.baseUrl !== previousValue) {
            this.logger.warn(`The server is being started with a base URL of ${this.baseUrl} while it was previously started with ${previousValue}. Resources generated with the previous server instance, such as a WebID, might no longer work correctly.`);
        }
        await this.storage.set(this.storageKey, this.baseUrl);
    }
}
exports.BaseUrlVerifier = BaseUrlVerifier;
//# sourceMappingURL=BaseUrlVerifier.js.map