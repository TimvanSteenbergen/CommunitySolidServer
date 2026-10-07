"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClientCredentialsStore = exports.CLIENT_CREDENTIALS_STORAGE_DESCRIPTION = exports.CLIENT_CREDENTIALS_STORAGE_TYPE = void 0;
const node_crypto_1 = require("node:crypto");
const Initializer_1 = require("../../../../init/Initializer");
const LogUtil_1 = require("../../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../../util/errors/ErrorUtil");
const InternalServerError_1 = require("../../../../util/errors/InternalServerError");
const LoginStorage_1 = require("../../account/util/LoginStorage");
exports.CLIENT_CREDENTIALS_STORAGE_TYPE = 'clientCredentials';
exports.CLIENT_CREDENTIALS_STORAGE_DESCRIPTION = {
    label: 'string',
    accountId: `id:${LoginStorage_1.ACCOUNT_TYPE}`,
    secret: 'string',
    webId: 'string',
};
/**
 * A {@link ClientCredentialsStore} that uses a {@link AccountLoginStorage} for storing the tokens.
 * Needs to be initialized before it can be used.
 */
class BaseClientCredentialsStore extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    initialized = false;
    // Wrong typings to prevent Components.js typing issues
    constructor(storage) {
        super();
        this.storage = storage;
    }
    // Initialize the type definitions
    async handle() {
        if (this.initialized) {
            return;
        }
        try {
            await this.storage.defineType(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, exports.CLIENT_CREDENTIALS_STORAGE_DESCRIPTION, false);
            await this.storage.createIndex(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, 'accountId');
            await this.storage.createIndex(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, 'label');
            this.initialized = true;
        }
        catch (cause) {
            throw new InternalServerError_1.InternalServerError(`Error defining client credentials in storage: ${(0, ErrorUtil_1.createErrorMessage)(cause)}`, { cause });
        }
    }
    async get(id) {
        return this.storage.get(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, id);
    }
    async findByLabel(label) {
        const result = await this.storage.find(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, { label });
        if (result.length === 0) {
            return;
        }
        return result[0];
    }
    async findByAccount(accountId) {
        return this.storage.find(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, { accountId });
    }
    async create(label, webId, accountId) {
        const secret = (0, node_crypto_1.randomBytes)(64).toString('hex');
        this.logger.debug(`Creating client credentials token with label ${label} for WebID ${webId} and account ${accountId}`);
        return this.storage.create(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, { accountId, label, webId, secret });
    }
    async delete(id) {
        this.logger.debug(`Deleting client credentials token with ID ${id}`);
        return this.storage.delete(exports.CLIENT_CREDENTIALS_STORAGE_TYPE, id);
    }
}
exports.BaseClientCredentialsStore = BaseClientCredentialsStore;
//# sourceMappingURL=BaseClientCredentialsStore.js.map