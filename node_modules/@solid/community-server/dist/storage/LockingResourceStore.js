"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockingResourceStore = void 0;
const BasicRepresentation_1 = require("../http/representation/BasicRepresentation");
const LogUtil_1 = require("../logging/LogUtil");
const StreamUtil_1 = require("../util/StreamUtil");
/**
 * Store that for every call acquires a lock before executing it on the requested resource,
 * and releases it afterwards.
 * In case the request returns a Representation the lock will only be released when the data stream is finished.
 *
 * For auxiliary resources the lock will be applied to the subject resource.
 * The actual operation is still executed on the auxiliary resource.
 */
class LockingResourceStore {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    source;
    locks;
    auxiliaryStrategy;
    constructor(source, locks, auxiliaryStrategy) {
        this.source = source;
        this.locks = locks;
        this.auxiliaryStrategy = auxiliaryStrategy;
    }
    async hasResource(identifier) {
        return this.locks.withReadLock(this.getLockIdentifier(identifier), async () => this.source.hasResource(identifier));
    }
    async getRepresentation(identifier, preferences, conditions) {
        return this.lockedRepresentationRun(this.getLockIdentifier(identifier), async () => this.source.getRepresentation(identifier, preferences, conditions));
    }
    async addResource(container, representation, conditions) {
        return this.locks.withWriteLock(this.getLockIdentifier(container), async () => this.source.addResource(container, representation, conditions));
    }
    async setRepresentation(identifier, representation, conditions) {
        return this.locks.withWriteLock(this.getLockIdentifier(identifier), async () => this.source.setRepresentation(identifier, representation, conditions));
    }
    async deleteResource(identifier, conditions) {
        return this.locks.withWriteLock(this.getLockIdentifier(identifier), async () => this.source.deleteResource(identifier, conditions));
    }
    async modifyResource(identifier, patch, conditions) {
        return this.locks.withWriteLock(this.getLockIdentifier(identifier), async () => this.source.modifyResource(identifier, patch, conditions));
    }
    /**
     * Acquires the correct identifier to lock this resource.
     * For auxiliary resources this means the subject identifier.
     */
    getLockIdentifier(identifier) {
        return this.auxiliaryStrategy.isAuxiliaryIdentifier(identifier) ?
            this.auxiliaryStrategy.getSubjectIdentifier(identifier) :
            identifier;
    }
    /**
     * Acquires a lock that is only released when all data of the resulting representation data has been read,
     * an error occurs, or the timeout has been triggered.
     * The resulting data stream will be adapted to reset the timer every time data is read.
     *
     * In case the data of the resulting stream is not needed it should be closed to prevent a timeout error.
     *
     * @param identifier - Identifier that should be locked.
     * @param whileLocked - Function to be executed while the resource is locked.
     */
    async lockedRepresentationRun(identifier, whileLocked) {
        // Create a new Promise that resolves to the resulting Representation
        // while only unlocking when the data has been read (or there's a timeout).
        // Note that we can't just return the result of `withReadLock` since that promise only
        // resolves when the stream is finished, while we want `lockedRepresentationRun` to resolve
        // once we have the Representation.
        // See https://github.com/CommunitySolidServer/CommunitySolidServer/pull/536#discussion_r562467957
        return new Promise((resolve, reject) => {
            let representation;
            // Make the resource time out to ensure that the lock is always released eventually.
            this.locks.withReadLock(identifier, async (maintainLock) => {
                representation = await whileLocked();
                resolve(this.createExpiringRepresentation(representation, maintainLock));
                // Release the lock when an error occurs or the data finished streaming
                await this.waitForStreamToEnd(representation.data);
            }).catch((error) => {
                // Destroy the source stream in case the lock times out
                representation?.data.destroy(error);
                // Let this function return an error in case something went wrong getting the data
                // or in case the timeout happens before `func` returned
                reject(error);
            });
        });
    }
    /**
     * Wraps a representation to make it reset the timeout timer every time data is read.
     *
     * @param representation - The representation to wrap
     * @param maintainLock - Function to call to reset the timer.
     */
    createExpiringRepresentation(representation, maintainLock) {
        const source = representation.data;
        // Spy on the source to maintain the lock upon reading.
        const data = Object.create(source, {
            read: {
                value(size) {
                    maintainLock();
                    return source.read(size);
                },
            },
        });
        return new BasicRepresentation_1.BasicRepresentation(data, representation.metadata, representation.binary);
    }
    /**
     * Returns a promise that resolve when the source stream is finished,
     * either by ending or emitting an error.
     * In the case of an error the stream will be destroyed if it hasn't been already.
     *
     * @param source - The input stream.
     */
    async waitForStreamToEnd(source) {
        try {
            await (0, StreamUtil_1.endOfStream)(source);
        }
        catch {
            // Destroy the stream in case of errors
            if (!source.destroyed) {
                source.destroy();
            }
        }
    }
}
exports.LockingResourceStore = LockingResourceStore;
//# sourceMappingURL=LockingResourceStore.js.map