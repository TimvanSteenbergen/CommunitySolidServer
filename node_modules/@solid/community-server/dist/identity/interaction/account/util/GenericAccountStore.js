"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericAccountStore = void 0;
const Initializer_1 = require("../../../../init/Initializer");
const LogUtil_1 = require("../../../../logging/LogUtil");
const ErrorUtil_1 = require("../../../../util/errors/ErrorUtil");
const InternalServerError_1 = require("../../../../util/errors/InternalServerError");
const LoginStorage_1 = require("./LoginStorage");
/**
 * A {@link AccountStore} that uses an {@link AccountLoginStorage} to keep track of the accounts.
 * Needs to be initialized before it can be used.
 */
class GenericAccountStore extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    description;
    storage;
    initialized = false;
    // Wrong typings to prevent Components.js typing issues
    constructor(storage, description) {
        super();
        this.description = description;
        this.storage = storage;
    }
    // Initialize the type definitions
    async handle() {
        if (this.initialized) {
            return;
        }
        try {
            await this.storage.defineType(LoginStorage_1.ACCOUNT_TYPE, this.description, false);
            this.initialized = true;
        }
        catch (cause) {
            throw new InternalServerError_1.InternalServerError(`Error defining account in storage: ${(0, ErrorUtil_1.createErrorMessage)(cause)}`, { cause });
        }
    }
    async create() {
        // {} is valid as only optional fields are allowed in the description
        const { id } = await this.storage.create(LoginStorage_1.ACCOUNT_TYPE, {});
        this.logger.debug(`Created new account ${id}`);
        return id;
    }
    async getSetting(id, setting) {
        const account = await this.storage.get(LoginStorage_1.ACCOUNT_TYPE, id);
        if (!account) {
            return;
        }
        return account[setting];
    }
    async updateSetting(id, setting, value) {
        await this.storage.setField(LoginStorage_1.ACCOUNT_TYPE, id, setting, value);
    }
}
exports.GenericAccountStore = GenericAccountStore;
//# sourceMappingURL=GenericAccountStore.js.map