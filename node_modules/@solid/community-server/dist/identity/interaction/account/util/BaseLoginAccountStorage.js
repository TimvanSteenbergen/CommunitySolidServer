"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLoginAccountStorage = void 0;
const LogUtil_1 = require("../../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../../util/errors/BadRequestHttpError");
const NotFoundHttpError_1 = require("../../../../util/errors/NotFoundHttpError");
const LoginStorage_1 = require("./LoginStorage");
const LOGIN_COUNT = 'linkedLoginsCount';
const MINIMUM_ACCOUNT_DESCRIPTION = {
    [LOGIN_COUNT]: 'number',
};
/**
 * A {@link LoginStorage} that wraps around another {@link IndexedStorage} to add specific account requirements.
 *   * New accounts will be removed after expiration time, in seconds, default is 1800,
 *     if no login method was added to them in that time.
 *   * Non-login types can not be created until the associated account has at least 1 login method.
 *   * Login types can not be deleted if they are the last login of the associated account.
 *
 * All of this is tracked by adding a new field to the account object,
 * that keeps track of how many login objects are associated with the account.
 */
class BaseLoginAccountStorage {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    loginTypes;
    storage;
    expiration;
    accountKeys;
    constructor(storage, expiration = 30 * 60) {
        this.loginTypes = [];
        this.storage = storage;
        this.expiration = expiration * 1000;
        this.accountKeys = {};
    }
    async defineType(type, description, isLogin) {
        // Determine potential new key pointing to account ID
        this.accountKeys[type] = Object.entries(description)
            .find(([, desc]) => desc === `id:${LoginStorage_1.ACCOUNT_TYPE}`)?.[0];
        if (type === LoginStorage_1.ACCOUNT_TYPE) {
            description = { ...description, ...MINIMUM_ACCOUNT_DESCRIPTION };
        }
        if (isLogin) {
            this.loginTypes.push(type);
        }
        return this.storage.defineType(type, description);
    }
    async createIndex(type, key) {
        return this.storage.createIndex(type, key);
    }
    async create(type, value) {
        // Check login count if it is not a new login method that we are trying to add,
        // to make sure the account is already valid.
        // If we are adding a new login method: increase the login counter by 1.
        const accountKey = this.accountKeys[type];
        if (accountKey) {
            const accountId = value[accountKey];
            await this.checkAccount(type, accountId, true);
        }
        if (type === LoginStorage_1.ACCOUNT_TYPE) {
            value = { ...value, [LOGIN_COUNT]: 0 };
        }
        const result = await this.storage.create(type, value);
        if (type === LoginStorage_1.ACCOUNT_TYPE) {
            this.createAccountTimeout(result.id);
        }
        return this.cleanOutput(result);
    }
    async has(type, id) {
        return this.storage.has(type, id);
    }
    async get(type, id) {
        return this.cleanOutput(await this.storage.get(type, id));
    }
    async find(type, query) {
        return (await this.storage.find(type, query)).map(this.cleanOutput);
    }
    async findIds(type, query) {
        return this.storage.findIds(type, query);
    }
    async set(type, value) {
        if (type === LoginStorage_1.ACCOUNT_TYPE) {
            // Get login count from original object
            const original = await this.storage.get(type, value.id);
            if (!original) {
                throw new NotFoundHttpError_1.NotFoundHttpError();
            }
            // This makes sure we don't lose the login count
            value = { ...value, [LOGIN_COUNT]: original[LOGIN_COUNT] };
        }
        return this.storage.set(type, value);
    }
    async setField(type, id, key, value) {
        return this.storage.setField(type, id, key, value);
    }
    async delete(type, id) {
        const accountKey = this.accountKeys[type];
        if (accountKey && this.loginTypes.includes(type)) {
            const original = await this.storage.get(type, id);
            if (!original) {
                throw new NotFoundHttpError_1.NotFoundHttpError();
            }
            const accountId = original[accountKey];
            await this.checkAccount(type, accountId, false);
        }
        return this.storage.delete(type, id);
    }
    async *entries(type) {
        for await (const entry of this.storage.entries(type)) {
            yield this.cleanOutput(entry);
        }
    }
    /**
     * Creates a timer that removes the account with the given ID if
     * it doesn't have a login method when the timer runs out.
     */
    createAccountTimeout(id) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const timer = setTimeout(async () => {
            const account = await this.storage.get(LoginStorage_1.ACCOUNT_TYPE, id);
            if (account && account[LOGIN_COUNT] === 0) {
                this.logger.debug(`Removing account with no login methods ${id}`);
                await this.storage.delete(LoginStorage_1.ACCOUNT_TYPE, id);
            }
        }, this.expiration);
        timer.unref();
    }
    /**
     * Makes sure of the operation, adding or removing an object of the given type,
     * is allowed, based on the current amount of login methods on the given account.
     */
    async checkAccount(type, accountId, add) {
        const account = await this.storage.get(LoginStorage_1.ACCOUNT_TYPE, accountId);
        if (!account) {
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        if (this.loginTypes.includes(type)) {
            if (!add && account[LOGIN_COUNT] === 1) {
                this.logger.warn(`Trying to remove last login method from account ${accountId}`);
                throw new BadRequestHttpError_1.BadRequestHttpError('An account needs at least 1 login method.');
            }
            account[LOGIN_COUNT] += add ? 1 : -1;
            await this.storage.set(LoginStorage_1.ACCOUNT_TYPE, account);
        }
        else if (account[LOGIN_COUNT] === 0) {
            this.logger.warn(`Trying to update account ${accountId} without login methods`);
            throw new BadRequestHttpError_1.BadRequestHttpError('An account needs at least 1 login method.');
        }
    }
    /**
     * Removes the field that keeps track of the login counts, to hide this from the output.
     */
    cleanOutput(value) {
        if (value) {
            delete value[LOGIN_COUNT];
        }
        return value;
    }
}
exports.BaseLoginAccountStorage = BaseLoginAccountStorage;
//# sourceMappingURL=BaseLoginAccountStorage.js.map