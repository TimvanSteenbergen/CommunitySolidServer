"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisLocker = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const LogUtil_1 = require("../../logging/LogUtil");
const LockUtils_1 = require("../LockUtils");
const RedisLuaScripts_1 = require("./scripts/RedisLuaScripts");
const attemptDefaults = { retryCount: -1, retryDelay: 50, retryJitter: 30 };
// Internal prefix for Redis keys;
const PREFIX_RW = '__RW__';
const PREFIX_LOCK = '__L__';
/**
 * A Redis Locker that can be used as both:
 *  *  a Read Write Locker that uses a (single) Redis server to store the locks and counts.
 *  *  a Resource Locker that uses a (single) Redis server to store the lock.
 * This solution should be process-safe. The only references to locks are string keys
 * derived from identifier paths.
 *
 * The Read Write algorithm roughly goes as follows:
 *  * Acquire a read lock: allowed as long as there is no write lock. On acquiring the read counter goes up.
 *  * Acquire a write lock: allowed as long as there is no other write lock AND the read counter is 0.
 *  * Release a read lock: decreases the read counter with 1
 *  * Release a write lock: unlocks the write lock
 *
 * The Resource locking algorithm uses a single mutex/lock.
 *
 * All operations, such as checking for a write lock AND read count, are executed in a single Lua script.
 * These scripts are used by Redis as a single new command.
 * Redis executes its operations in a single thread, as such, each such operation can be considered atomic.
 *
 * The operation to (un)lock will always resolve with either 1/OK/true if succeeded or 0/false if not succeeded.
 * Rejection with errors will be happen on actual failures. Retrying the (un)lock operations will be done by making
 * use of the LockUtils' {@link retryFunctionUntil} function.
 *
 * * @see [Redis Commands documentation](https://redis.io/commands/)
 * * @see [Redis Lua scripting documentation](https://redis.io/docs/manual/programmability/)
 * * @see [ioredis Lua scripting API](https://github.com/luin/ioredis#lua-scripting)
 */
class RedisLocker {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    redis;
    redisRw;
    redisLock;
    attemptSettings;
    namespacePrefix;
    finalized = false;
    /**
     * Creates a new RedisClient
     *
     * @param redisClient - Redis connection string of a standalone Redis node
     * @param attemptSettings - Override default AttemptSettings
     * @param redisSettings - Addition settings used to create the Redis client or to interact with the Redis server
     */
    constructor(redisClient = '127.0.0.1:6379', attemptSettings = {}, redisSettings) {
        redisSettings = { namespacePrefix: '', ...redisSettings };
        const { namespacePrefix, ...options } = redisSettings;
        this.redis = this.createRedisClient(redisClient, options);
        this.attemptSettings = { ...attemptDefaults, ...attemptSettings };
        this.namespacePrefix = namespacePrefix;
        // Register lua scripts
        for (const [name, script] of Object.entries(RedisLuaScripts_1.REDIS_LUA_SCRIPTS)) {
            this.redis.defineCommand(name, { numberOfKeys: 1, lua: script });
        }
        this.redisRw = this.redis;
        this.redisLock = this.redis;
    }
    /**
     * Generate and return a RedisClient based on the provided string
     *
     * @param redisClientString - A string that contains either a host address and a
     *                            port number like '127.0.0.1:6379' or just a port number like '6379'.
     */
    createRedisClient(redisClientString, options) {
        if (redisClientString.length > 0) {
            // Check if port number or ip with port number
            // Definitely not perfect, but configuring this is only for experienced users
            const match = /^(?:([^:]+):)?(\d{4,5})$/u.exec(redisClientString);
            if (!match?.[2]) {
                // At least a port number should be provided
                throw new Error(`Invalid data provided to create a Redis client: ${redisClientString}\n
            Please provide a port number like '6379' or a host address and a port number like '127.0.0.1:6379'`);
            }
            const port = Number(match[2]);
            const host = match[1];
            return new ioredis_1.default(port, host, options);
        }
        throw new Error(`Empty redisClientString provided!\n
            Please provide a port number like '6379' or a host address and a port number like '127.0.0.1:6379'`);
    }
    /**
     * Create a scoped Redis key for Read-Write locking.
     *
     * @param identifier - The identifier object to create a Redis key for
     *
     * @returns A scoped Redis key that allows cleanup afterwards without affecting other keys.
     */
    getReadWriteKey(identifier) {
        return `${this.namespacePrefix}${PREFIX_RW}${identifier.path}`;
    }
    /**
     * Create a scoped Redis key for Resource locking.
     *
     * @param identifier - The identifier object to create a Redis key for
     *
     * @returns A scoped Redis key that allows cleanup afterwards without affecting other keys.
     */
    getResourceKey(identifier) {
        return `${this.namespacePrefix}${PREFIX_LOCK}${identifier.path}`;
    }
    /* ReadWriteLocker methods */
    /**
     * Wrapper function for all (un)lock operations. If the `fn()` resolves to false (after applying
     * {@link fromResp2ToBool}, the result will be swallowed. When `fn()` resolves to true, this wrapper
     * will return true. Any error coming from `fn()` will be thrown.
     *
     * @param fn - The function reference to swallow false from.
     */
    swallowFalse(fn) {
        if (this.finalized) {
            throw new Error('Invalid state: cannot execute Redis operation once finalize() has been called.');
        }
        return async () => {
            const result = await (0, RedisLuaScripts_1.fromResp2ToBool)(fn());
            // Swallow any result resolving to `false`
            if (result) {
                return true;
            }
        };
    }
    async withReadLock(identifier, whileLocked) {
        const key = this.getReadWriteKey(identifier);
        await (0, LockUtils_1.retryFunction)(this.swallowFalse(this.redisRw.acquireReadLock.bind(this.redisRw, key)), this.attemptSettings);
        try {
            return await whileLocked();
        }
        finally {
            await (0, LockUtils_1.retryFunction)(this.swallowFalse(this.redisRw.releaseReadLock.bind(this.redisRw, key)), this.attemptSettings);
        }
    }
    async withWriteLock(identifier, whileLocked) {
        const key = this.getReadWriteKey(identifier);
        await (0, LockUtils_1.retryFunction)(this.swallowFalse(this.redisRw.acquireWriteLock.bind(this.redisRw, key)), this.attemptSettings);
        try {
            return await whileLocked();
        }
        finally {
            await (0, LockUtils_1.retryFunction)(this.swallowFalse(this.redisRw.releaseWriteLock.bind(this.redisRw, key)), this.attemptSettings);
        }
    }
    /* ResourceLocker methods */
    async acquire(identifier) {
        const key = this.getResourceKey(identifier);
        await (0, LockUtils_1.retryFunction)(this.swallowFalse(this.redisLock.acquireLock.bind(this.redisLock, key)), this.attemptSettings);
    }
    async release(identifier) {
        const key = this.getResourceKey(identifier);
        await (0, LockUtils_1.retryFunction)(this.swallowFalse(this.redisLock.releaseLock.bind(this.redisLock, key)), this.attemptSettings);
    }
    /* Initializer & Finalizer methods */
    async initialize() {
        // On server start: remove all existing (dangling) locks, so new requests are not blocked.
        return this.clearLocks();
    }
    async finalize() {
        this.finalized = true;
        try {
            // On controlled server shutdown: clean up all existing locks.
            await this.clearLocks();
        }
        finally {
            // Always quit the redis client
            await this.redis.quit();
        }
    }
    /**
     * Remove any lock still open
     */
    async clearLocks() {
        const keysRw = await this.redisRw.keys(`${this.namespacePrefix}${PREFIX_RW}*`);
        if (keysRw.length > 0) {
            await this.redisRw.del(...keysRw);
        }
        const keysLock = await this.redisLock.keys(`${this.namespacePrefix}${PREFIX_LOCK}*`);
        if (keysLock.length > 0) {
            await this.redisLock.del(...keysLock);
        }
    }
}
exports.RedisLocker = RedisLocker;
//# sourceMappingURL=RedisLocker.js.map