import type { Callback, Redis } from 'ioredis';
/**
 * Lua scripts to be used as Redis operations.
 */
export declare const REDIS_LUA_SCRIPTS: {
    readonly acquireReadLock: "\n    -- Return 0 if an entry already exists.\n    local lockKey = KEYS[1]..\".wlock\"\n    if redis.call(\"exists\", lockKey) == 1 then\n      return 0\n    end\n    \n    -- Return true if succeeded (and counter is incremented)\n    local countKey = KEYS[1]..\".count\"\n    return redis.call(\"incr\", countKey) > 0\n    ";
    readonly acquireWriteLock: "\n    -- Return 0 if a lock entry already exists or read count is > 0\n    local lockKey = KEYS[1]..\".wlock\"\n    local countKey = KEYS[1]..\".count\"\n    local count = tonumber(redis.call(\"get\", countKey))\n    if ((redis.call(\"exists\", lockKey) == 1) or (count ~= nil and count > 0)) then\n      return 0\n    end\n    \n    -- Set lock and respond with 'OK' if succeeded (otherwise null)\n    return redis.call(\"set\", lockKey, \"locked\");\n    ";
    readonly releaseReadLock: "\n      -- Return 1 after decreasing the counter, if counter is < 0 now: return '-ERR'\n      local countKey = KEYS[1]..\".count\"\n      local result = redis.call(\"decr\", countKey)\n      if result >= 0 then\n        return 1\n      else \n        return redis.error_reply(\"Error trying to release readlock when read count was 0.\")\n      end\n    ";
    readonly releaseWriteLock: "\n      -- Release the lock and reply with 1 if succeeded (otherwise return '-ERR')\n      local lockKey = KEYS[1]..\".wlock\"\n      local result = redis.call(\"del\", lockKey)\n      if (result > 0) then\n        return 1\n      else\n        return redis.error_reply(\"Error trying to release writelock that did not exist.\")\n      end\n    ";
    readonly acquireLock: "\n      -- Return 0 if lock entry already exists, or 'OK' if it succeeds in setting the lock entry.\n      local key = KEYS[1]..\".lock\"\n      if redis.call(\"exists\", key) == 1 then\n        return 0\n      end\n      \n      -- Return 'OK' if succeeded setting entry\n      return redis.call(\"set\", key, \"locked\");\n      ";
    readonly releaseLock: "\n      -- Release the lock and reply with 1 if succeeded (otherwise return '-ERR')\n      local key = KEYS[1]..\".lock\"\n      local result = redis.call(\"del\", key)\n      if result > 0 then\n        return 1\n      else\n        return redis.error_reply(\"Error trying to release lock that did not exist.\")\n      end\n    ";
};
export type RedisAnswer = 0 | 1 | null | string;
/**
 * Convert a RESP2 response to a boolean.
 *
 * @param result - The Promise-wrapped result of a RESP2 Redis function.
 *
 * @returns * `1`, `'OK'`: return `true`
 *          * `0`: returns `false`
 *          * `-ERR`: throw error
 *
 * @throws On `-ERR*` `null` or any other value
 */
export declare function fromResp2ToBool(result: Promise<RedisAnswer>): Promise<boolean>;
export interface RedisReadWriteLock extends Redis {
    /**
     * Try to acquire a readLock on `resourceIdentifierPath`.
     * Will succeed if there are no write locks.
     *
     * @returns 1 if succeeded. 0 if not possible.
     */
    acquireReadLock: (resourceIdentifierPath: string, callback?: Callback<string>) => Promise<RedisAnswer>;
    /**
     * Try to acquire a writeLock on `resourceIdentifierPath`.
     * Only works if no other write lock is present and the read counter is 0.
     *
     * @returns 'OK' if succeeded, 0 if not possible.
     */
    acquireWriteLock: (resourceIdentifierPath: string, callback?: Callback<string>) => Promise<RedisAnswer>;
    /**
     * Release readLock. This means decrementing the read counter with 1.
     *
     * @returns 1 if succeeded. '-ERR' if read count goes below 0
     */
    releaseReadLock: (resourceIdentifierPath: string, callback?: Callback<string>) => Promise<RedisAnswer>;
    /**
     * Release writeLock. This means deleting the write lock.
     *
     * @returns 1 if succeeded. '-ERR' if write lock was non-existing.
     */
    releaseWriteLock: (resourceIdentifierPath: string, callback?: Callback<string>) => Promise<RedisAnswer>;
}
export interface RedisResourceLock extends Redis {
    /**
     * Try to acquire a lock  on `resourceIdentifierPath`.
     * Only works if no other lock is present.
     *
     * @returns 'OK' if succeeded, 0 if not possible.
     */
    acquireLock: (resourceIdentifierPath: string, callback?: Callback<string>) => Promise<RedisAnswer>;
    /**
     * Release lock. This means deleting the lock.
     *
     * @returns 1 if succeeded. '-ERR' if lock was non-existing.
     */
    releaseLock: (resourceIdentifierPath: string, callback?: Callback<string>) => Promise<RedisAnswer>;
}
