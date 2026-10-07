"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseWebIdStore = exports.WEBID_STORAGE_DESCRIPTION = exports.WEBID_STORAGE_TYPE = void 0;
const Initializer_1 = require("../../../../init/Initializer");
const LogUtil_1 = require("../../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../../util/errors/BadRequestHttpError");
const ErrorUtil_1 = require("../../../../util/errors/ErrorUtil");
const InternalServerError_1 = require("../../../../util/errors/InternalServerError");
const LoginStorage_1 = require("../../account/util/LoginStorage");
exports.WEBID_STORAGE_TYPE = 'webIdLink';
exports.WEBID_STORAGE_DESCRIPTION = {
    webId: 'string',
    accountId: `id:${LoginStorage_1.ACCOUNT_TYPE}`,
};
/**
 * A {@link WebIdStore} using a {@link AccountLoginStorage} to store the links.
 * Needs to be initialized before it can be used.
 */
class BaseWebIdStore extends Initializer_1.Initializer {
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
            await this.storage.defineType(exports.WEBID_STORAGE_TYPE, exports.WEBID_STORAGE_DESCRIPTION, false);
            await this.storage.createIndex(exports.WEBID_STORAGE_TYPE, 'accountId');
            await this.storage.createIndex(exports.WEBID_STORAGE_TYPE, 'webId');
            this.initialized = true;
        }
        catch (cause) {
            throw new InternalServerError_1.InternalServerError(`Error defining WebID links in storage: ${(0, ErrorUtil_1.createErrorMessage)(cause)}`, { cause });
        }
    }
    async get(id) {
        return this.storage.get(exports.WEBID_STORAGE_TYPE, id);
    }
    async isLinked(webId, accountId) {
        const result = await this.storage.find(exports.WEBID_STORAGE_TYPE, { webId, accountId });
        return result.length > 0;
    }
    async findLinks(accountId) {
        return (await this.storage.find(exports.WEBID_STORAGE_TYPE, { accountId }))
            .map(({ id, webId }) => ({ id, webId }));
    }
    async create(webId, accountId) {
        if (await this.isLinked(webId, accountId)) {
            this.logger.warn(`Trying to link WebID ${webId} which is already linked to this account ${accountId}`);
            throw new BadRequestHttpError_1.BadRequestHttpError(`${webId} is already registered to this account.`);
        }
        const result = await this.storage.create(exports.WEBID_STORAGE_TYPE, { webId, accountId });
        this.logger.debug(`Linked WebID ${webId} to account ${accountId}`);
        return result.id;
    }
    async delete(linkId) {
        this.logger.debug(`Deleting WebID link with ID ${linkId}`);
        return this.storage.delete(exports.WEBID_STORAGE_TYPE, linkId);
    }
}
exports.BaseWebIdStore = BaseWebIdStore;
//# sourceMappingURL=BaseWebIdStore.js.map