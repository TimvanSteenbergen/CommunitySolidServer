"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemResourceLocker = void 0;
const node_crypto_1 = require("node:crypto");
const fs_extra_1 = require("fs-extra");
const proper_lockfile_1 = require("proper-lockfile");
const LogUtil_1 = require("../../logging/LogUtil");
const ErrorUtil_1 = require("../errors/ErrorUtil");
const InternalServerError_1 = require("../errors/InternalServerError");
const LockUtils_1 = require("../LockUtils");
const PathUtil_1 = require("../PathUtil");
const defaultLockOptions = {
    // This must be set to false! If not every lock request will try to resolve the path to the file.
    // Since however this locker maps all locks to a common internal folder that might be non-existing on start,
    // resolving those paths would throw an filesystem error.
    realpath: false,
    /** The number of retries or a [retry](https://www.npmjs.org/package/retry) options object, defaults to 0 */
    retries: 0,
};
const defaultUnlockOptions = {
    // This must be set to false! If not every lock request will try to resolve the path to the file.
    // Since however this locker maps all locks to a common internal folder that might be non-existing on start,
    // resolving those paths would throw an filesystem error.
    realpath: false,
};
const attemptDefaults = { retryCount: -1, retryDelay: 50, retryJitter: 30 };
function isCodedError(err) {
    return typeof err === 'object' && err !== null && 'code' in err;
}
/**
 * A resource locker making use of the [proper-lockfile](https://www.npmjs.com/package/proper-lockfile) library.
 * Note that no locks are kept in memory, thus this is considered thread- and process-safe.
 * While it stores the actual locks on disk, it also tracks them in memory for when they need to be released.
 * This means only the worker thread that acquired a lock can release it again,
 * making this implementation unusable in combination with a wrapping read/write lock implementation.
 *
 * This **proper-lockfile** library has its own retry mechanism for the operations, since a lock/unlock call will
 * either resolve successfully or reject immediately with the causing error. The retry function of the library
 * however will be ignored and replaced by our own LockUtils' {@link retryFunction} function.
 */
class FileSystemResourceLocker {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    attemptSettings;
    lockOptions;
    throwOnCompromise;
    /** Folder that stores the locks */
    lockFolder;
    finalized = false;
    /**
     * Create a new FileSystemResourceLocker
     *
     * @param args - Configures the locker using the specified FileSystemResourceLockerArgs instance.
     */
    constructor(args) {
        const { rootFilePath, lockDirectory, attemptSettings } = args;
        // Need to create lock options for this instance due to the custom `onCompromised`
        this.lockOptions = { ...defaultLockOptions, onCompromised: this.customOnCompromised.bind(this) };
        this.attemptSettings = { ...attemptDefaults, ...attemptSettings };
        this.throwOnCompromise = args.throwOnCompromise;
        this.lockFolder = (0, PathUtil_1.joinFilePath)(rootFilePath, lockDirectory ?? '/.internal/locks');
    }
    /**
     * Wrapper function for all (un)lock operations. Any errors coming from the `fn()` will be swallowed.
     * Only `ENOTACQUIRED` errors wills be thrown (trying to release lock that didn't exist).
     * This wrapper returns undefined because {@link retryFunction} expects that when a retry needs to happen.
     *
     * @param fn - The function reference to swallow errors from.
     *
     * @returns Boolean or undefined.
     */
    swallowErrors(fn) {
        return async () => {
            try {
                await fn();
                return true;
            }
            catch (err) {
                // Only this error should be thrown
                if (isCodedError(err) && err.code === 'ENOTACQUIRED') {
                    throw err;
                }
            }
        };
    }
    async acquire(identifier) {
        const { path } = identifier;
        this.logger.debug(`Acquiring lock for ${path}`);
        try {
            const opt = this.generateOptions(identifier, this.lockOptions);
            await (0, LockUtils_1.retryFunction)(this.swallowErrors(proper_lockfile_1.lock.bind(null, path, opt)), this.attemptSettings);
        }
        catch (err) {
            throw new InternalServerError_1.InternalServerError(`Error trying to acquire lock for ${path}. ${(0, ErrorUtil_1.createErrorMessage)(err)}`, { cause: err });
        }
    }
    async release(identifier) {
        const { path } = identifier;
        this.logger.debug(`Releasing lock for ${path}`);
        try {
            const opt = this.generateOptions(identifier, defaultUnlockOptions);
            await (0, LockUtils_1.retryFunction)(this.swallowErrors(proper_lockfile_1.unlock.bind(null, path, opt)), this.attemptSettings);
        }
        catch (err) {
            throw new InternalServerError_1.InternalServerError(`Error trying to release lock for ${path}.  ${(0, ErrorUtil_1.createErrorMessage)(err)}`, { cause: err });
        }
    }
    /**
     * Map the identifier path to a unique path inside the {@link lockFolder}.
     *
     * @param identifier - ResourceIdentifier to generate (Un)LockOptions for.
     *
     * @returns Full path.
     */
    toLockfilePath(identifier) {
        const hash = (0, node_crypto_1.createHash)('md5');
        const { path } = identifier;
        return (0, PathUtil_1.joinFilePath)(this.lockFolder, hash.update(path).digest('hex'));
    }
    /**
     * Generate LockOptions or UnlockOptions depending on the type of defauls given.
     * A custom lockFilePath mapping strategy will be used.
     *
     * @param identifier - ResourceIdentifier to generate (Un)LockOptions for
     * @param defaults - The default options. (lockFilePath will get overwritten)
     *
     * @returns LockOptions or UnlockOptions
     */
    generateOptions(identifier, defaults) {
        const lockfilePath = this.toLockfilePath(identifier);
        return {
            ...defaults,
            lockfilePath,
        };
    }
    /**
     * Initializer method to be executed on server start. This makes sure that no pre-existing (dangling) locks
     * remain on disk, so that request will not be blocked because a lock was acquired in the previous server instance.
     *
     * NOTE: this also removes locks created by the GreedyReadWriteLocker.
     * (See issue: https://github.com/CommunitySolidServer/CommunitySolidServer/issues/1358)
     */
    async initialize() {
        // Remove all existing (dangling) locks so new requests are not blocked (by removing the lock folder).
        await (0, fs_extra_1.remove)(this.lockFolder);
        // Put the folder back since `proper-lockfile` depends on its existence.
        return (0, fs_extra_1.ensureDir)(this.lockFolder);
    }
    async finalize() {
        // Register that finalize was called by setting a state variable.
        this.finalized = true;
        // NOTE: in contrast with initialize(), the lock folder is not cleared here, as the proper-lock library
        // manages these files and will attempt to clear existing files when the process is shutdown gracefully.
    }
    /**
     * This function is used to override the proper-lock onCompromised function.
     * Once the locker was finalized, it will log the provided error instead of throwing it
     * This allows for a clean shutdown procedure.
     */
    customOnCompromised(err) {
        if (this.finalized) {
            this.logger.warn(`onCompromised was called with error: ${err.message}`);
        }
        else if (this.throwOnCompromise) {
            throw err;
        }
        else {
            this.logger.error(`Lock was compromised: ${err.message}`);
        }
    }
}
exports.FileSystemResourceLocker = FileSystemResourceLocker;
//# sourceMappingURL=FileSystemResourceLocker.js.map