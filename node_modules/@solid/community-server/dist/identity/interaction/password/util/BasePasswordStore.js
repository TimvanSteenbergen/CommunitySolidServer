"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePasswordStore = exports.PASSWORD_STORAGE_DESCRIPTION = exports.PASSWORD_STORAGE_TYPE = void 0;
const bcryptjs_1 = require("bcryptjs");
const Initializer_1 = require("../../../../init/Initializer");
const LogUtil_1 = require("../../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../../util/errors/BadRequestHttpError");
const ErrorUtil_1 = require("../../../../util/errors/ErrorUtil");
const ForbiddenHttpError_1 = require("../../../../util/errors/ForbiddenHttpError");
const InternalServerError_1 = require("../../../../util/errors/InternalServerError");
const LoginStorage_1 = require("../../account/util/LoginStorage");
exports.PASSWORD_STORAGE_TYPE = 'password';
exports.PASSWORD_STORAGE_DESCRIPTION = {
    email: 'string',
    password: 'string',
    verified: 'boolean',
    accountId: `id:${LoginStorage_1.ACCOUNT_TYPE}`,
};
/**
 * A {@link PasswordStore} that uses a {@link KeyValueStorage} to store the entries.
 * Passwords are hashed and salted.
 * Default `saltRounds` is 10.
 */
class BasePasswordStore extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    saltRounds;
    initialized = false;
    // Wrong typings to prevent Components.js typing issues
    constructor(storage, saltRounds = 10) {
        super();
        this.storage = storage;
        this.saltRounds = saltRounds;
    }
    // Initialize the type definitions
    async handle() {
        if (this.initialized) {
            return;
        }
        try {
            await this.storage.defineType(exports.PASSWORD_STORAGE_TYPE, exports.PASSWORD_STORAGE_DESCRIPTION, true);
            await this.storage.createIndex(exports.PASSWORD_STORAGE_TYPE, 'accountId');
            await this.storage.createIndex(exports.PASSWORD_STORAGE_TYPE, 'email');
            this.initialized = true;
        }
        catch (cause) {
            throw new InternalServerError_1.InternalServerError(`Error defining email/password in storage: ${(0, ErrorUtil_1.createErrorMessage)(cause)}`, { cause });
        }
    }
    async create(email, accountId, password) {
        if (await this.findByEmail(email)) {
            this.logger.warn(`Trying to create duplicate login for email ${email}`);
            throw new BadRequestHttpError_1.BadRequestHttpError('There already is a login for this e-mail address.');
        }
        const payload = await this.storage.create(exports.PASSWORD_STORAGE_TYPE, {
            accountId,
            email: email.toLowerCase(),
            password: await (0, bcryptjs_1.hash)(password, this.saltRounds),
            verified: false,
        });
        return payload.id;
    }
    async get(id) {
        const result = await this.storage.get(exports.PASSWORD_STORAGE_TYPE, id);
        if (!result) {
            return;
        }
        return { email: result.email, accountId: result.accountId };
    }
    async findByEmail(email) {
        const payload = await this.storage.find(exports.PASSWORD_STORAGE_TYPE, { email: email.toLowerCase() });
        if (payload.length === 0) {
            return;
        }
        return { accountId: payload[0].accountId, id: payload[0].id };
    }
    async findByAccount(accountId) {
        return (await this.storage.find(exports.PASSWORD_STORAGE_TYPE, { accountId }))
            .map(({ id, email }) => ({ id, email }));
    }
    async confirmVerification(id) {
        if (!await this.storage.has(exports.PASSWORD_STORAGE_TYPE, id)) {
            this.logger.warn(`Trying to verify unknown password login ${id}`);
            throw new ForbiddenHttpError_1.ForbiddenHttpError('Login does not exist.');
        }
        await this.storage.setField(exports.PASSWORD_STORAGE_TYPE, id, 'verified', true);
    }
    async authenticate(email, password) {
        const payload = await this.storage.find(exports.PASSWORD_STORAGE_TYPE, { email: email.toLowerCase() });
        if (payload.length === 0) {
            this.logger.warn(`Trying to get account info for unknown email ${email}`);
            throw new ForbiddenHttpError_1.ForbiddenHttpError('Invalid email/password combination.');
        }
        if (!await (0, bcryptjs_1.compare)(password, payload[0].password)) {
            this.logger.warn(`Incorrect password for email ${email}`);
            throw new ForbiddenHttpError_1.ForbiddenHttpError('Invalid email/password combination.');
        }
        const { verified, accountId, id } = payload[0];
        if (!verified) {
            this.logger.warn(`Trying to get account info for unverified email ${email}`);
            throw new ForbiddenHttpError_1.ForbiddenHttpError('Login still needs to be verified.');
        }
        return { accountId, id };
    }
    async update(id, password) {
        if (!await this.storage.has(exports.PASSWORD_STORAGE_TYPE, id)) {
            this.logger.warn(`Trying to update unknown password login ${id}`);
            throw new ForbiddenHttpError_1.ForbiddenHttpError('Login does not exist.');
        }
        await this.storage.setField(exports.PASSWORD_STORAGE_TYPE, id, 'password', await (0, bcryptjs_1.hash)(password, this.saltRounds));
    }
    async delete(id) {
        return this.storage.delete(exports.PASSWORD_STORAGE_TYPE, id);
    }
}
exports.BasePasswordStore = BasePasswordStore;
//# sourceMappingURL=BasePasswordStore.js.map