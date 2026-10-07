"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePodStore = exports.OWNER_STORAGE_DESCRIPTION = exports.OWNER_STORAGE_TYPE = exports.POD_STORAGE_DESCRIPTION = exports.POD_STORAGE_TYPE = void 0;
const Initializer_1 = require("../../../../init/Initializer");
const LogUtil_1 = require("../../../../logging/LogUtil");
const BadRequestHttpError_1 = require("../../../../util/errors/BadRequestHttpError");
const ErrorUtil_1 = require("../../../../util/errors/ErrorUtil");
const InternalServerError_1 = require("../../../../util/errors/InternalServerError");
const LoginStorage_1 = require("../../account/util/LoginStorage");
exports.POD_STORAGE_TYPE = 'pod';
exports.POD_STORAGE_DESCRIPTION = {
    baseUrl: 'string',
    accountId: `id:${LoginStorage_1.ACCOUNT_TYPE}`,
};
exports.OWNER_STORAGE_TYPE = 'owner';
exports.OWNER_STORAGE_DESCRIPTION = {
    webId: 'string',
    visible: 'boolean',
    podId: `id:${exports.POD_STORAGE_TYPE}`,
};
/**
 * A {@link PodStore} implementation using a {@link PodManager} to create pods
 * and a {@link AccountLoginStorage} to store the data.
 * Needs to be initialized before it can be used.
 *
 * Adds the initial WebID as the owner of the pod.
 * By default, this owner is not exposed through a link header.
 * This can be changed by setting the constructor `visible` parameter to `true`.
 */
class BasePodStore extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    manager;
    visible;
    initialized = false;
    // Wrong typings to prevent Components.js typing issues
    constructor(storage, manager, visible = false) {
        super();
        this.storage = storage;
        this.visible = visible;
        this.manager = manager;
    }
    // Initialize the type definitions
    async handle() {
        if (this.initialized) {
            return;
        }
        try {
            await this.storage.defineType(exports.POD_STORAGE_TYPE, exports.POD_STORAGE_DESCRIPTION, false);
            await this.storage.createIndex(exports.POD_STORAGE_TYPE, 'accountId');
            await this.storage.createIndex(exports.POD_STORAGE_TYPE, 'baseUrl');
            await this.storage.defineType(exports.OWNER_STORAGE_TYPE, exports.OWNER_STORAGE_DESCRIPTION, false);
            await this.storage.createIndex(exports.OWNER_STORAGE_TYPE, 'podId');
            this.initialized = true;
        }
        catch (cause) {
            throw new InternalServerError_1.InternalServerError(`Error defining pods in storage: ${(0, ErrorUtil_1.createErrorMessage)(cause)}`, { cause });
        }
    }
    async create(accountId, settings, overwrite) {
        // Adding pod to storage first as we cannot undo creating the pod below.
        // This call might also fail because there is no login method yet on the account.
        const pod = await this.storage.create(exports.POD_STORAGE_TYPE, { baseUrl: settings.base.path, accountId });
        await this.storage.create(exports.OWNER_STORAGE_TYPE, { podId: pod.id, webId: settings.webId, visible: this.visible });
        try {
            await this.manager.createPod(settings, overwrite);
        }
        catch (error) {
            this.logger.warn(`Pod creation failed for account ${accountId}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            await this.storage.delete(exports.POD_STORAGE_TYPE, pod.id);
            throw new BadRequestHttpError_1.BadRequestHttpError(`Pod creation failed: ${(0, ErrorUtil_1.createErrorMessage)(error)}`, { cause: error });
        }
        this.logger.debug(`Created pod ${settings.name} for account ${accountId}`);
        return pod.id;
    }
    async get(id) {
        const pod = await this.storage.get(exports.POD_STORAGE_TYPE, id);
        if (!pod) {
            return;
        }
        return { baseUrl: pod.baseUrl, accountId: pod.accountId };
    }
    async findByBaseUrl(baseUrl) {
        const result = await this.storage.find(exports.POD_STORAGE_TYPE, { baseUrl });
        if (result.length === 0) {
            return;
        }
        return { id: result[0].id, accountId: result[0].accountId };
    }
    async findPods(accountId) {
        return (await this.storage.find(exports.POD_STORAGE_TYPE, { accountId }))
            .map(({ id, baseUrl }) => ({ id, baseUrl }));
    }
    async getOwners(id) {
        const results = await this.storage.find(exports.OWNER_STORAGE_TYPE, { podId: id });
        if (results.length === 0) {
            return;
        }
        return results.map((result) => ({ webId: result.webId, visible: result.visible }));
    }
    async updateOwner(id, webId, visible) {
        // Need to first check if there already is an owner with the given WebID
        // so we know if we need to create or update.
        const matches = await this.storage.find(exports.OWNER_STORAGE_TYPE, { webId, podId: id });
        if (matches.length === 0) {
            await this.storage.create(exports.OWNER_STORAGE_TYPE, { webId, visible, podId: id });
        }
        else {
            await this.storage.setField(exports.OWNER_STORAGE_TYPE, matches[0].id, 'visible', visible);
        }
    }
    async removeOwner(id, webId) {
        const owners = await this.storage.find(exports.OWNER_STORAGE_TYPE, { podId: id });
        const match = owners.find((owner) => owner.webId === webId);
        if (!match) {
            return;
        }
        if (owners.length === 1) {
            throw new BadRequestHttpError_1.BadRequestHttpError('Unable to remove the last owner of a pod.');
        }
        await this.storage.delete(exports.OWNER_STORAGE_TYPE, match.id);
    }
}
exports.BasePodStore = BasePodStore;
//# sourceMappingURL=BasePodStore.js.map