"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiringAdapterFactory = exports.ExpiringAdapter = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
/**
 * An IDP storage adapter that uses an ExpiringStorage
 * to persist data.
 */
class ExpiringAdapter {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    name;
    storage;
    constructor(name, storage) {
        this.name = name;
        this.storage = storage;
    }
    grantKeyFor(id) {
        return `grants/${encodeURIComponent(id)}`;
    }
    userCodeKeyFor(userCode) {
        return `user_codes/${encodeURIComponent(userCode)}`;
    }
    uidKeyFor(uid) {
        return `uids/${encodeURIComponent(uid)}`;
    }
    keyFor(id) {
        return `${this.name}/${encodeURIComponent(id)}`;
    }
    async upsert(id, payload, expiresIn) {
        // Despite what the typings say, `expiresIn` can be undefined
        const expiration = expiresIn ? expiresIn * 1000 : undefined;
        const key = this.keyFor(id);
        this.logger.debug(`Storing payload data for ${id}`);
        const storagePromises = [
            this.storage.set(key, payload, expiration),
        ];
        if (payload.grantId) {
            storagePromises.push((async () => {
                const grantKey = this.grantKeyFor(payload.grantId);
                const grants = (await this.storage.get(grantKey) ?? []);
                grants.push(key);
                await this.storage.set(grantKey, grants, expiration);
            })());
        }
        if (payload.userCode) {
            storagePromises.push(this.storage.set(this.userCodeKeyFor(payload.userCode), id, expiration));
        }
        if (payload.uid) {
            storagePromises.push(this.storage.set(this.uidKeyFor(payload.uid), id, expiration));
        }
        await Promise.all(storagePromises);
    }
    async find(id) {
        return await this.storage.get(this.keyFor(id));
    }
    async findByUserCode(userCode) {
        const id = await this.storage.get(this.userCodeKeyFor(userCode));
        return this.find(id);
    }
    async findByUid(uid) {
        const id = await this.storage.get(this.uidKeyFor(uid));
        return this.find(id);
    }
    async destroy(id) {
        await this.storage.delete(this.keyFor(id));
    }
    async revokeByGrantId(grantId) {
        this.logger.debug(`Revoking grantId ${grantId}`);
        const grantKey = this.grantKeyFor(grantId);
        const grants = await this.storage.get(grantKey);
        if (!grants) {
            return;
        }
        const deletePromises = [];
        for (const grant of grants) {
            deletePromises.push(this.storage.delete(grant));
        }
        deletePromises.push(this.storage.delete(grantKey));
        await Promise.all(deletePromises);
    }
    async consume(id) {
        const payload = await this.find(id);
        if (!payload) {
            return;
        }
        payload.consumed = Math.floor(Date.now() / 1000);
        await this.storage.set(this.keyFor(id), payload);
    }
}
exports.ExpiringAdapter = ExpiringAdapter;
/**
 * The factory for a ExpiringStorageAdapter
 */
class ExpiringAdapterFactory {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    createStorageAdapter(name) {
        return new ExpiringAdapter(name, this.storage);
    }
}
exports.ExpiringAdapterFactory = ExpiringAdapterFactory;
//# sourceMappingURL=ExpiringAdapterFactory.js.map