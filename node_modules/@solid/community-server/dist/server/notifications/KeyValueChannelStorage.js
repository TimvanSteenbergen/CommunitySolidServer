"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyValueChannelStorage = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
/**
 * Stores all the {@link NotificationChannel} in a {@link KeyValueStorage}.
 * Encodes IDs/topics before storing them in the KeyValueStorage.
 *
 * Uses a {@link ReadWriteLocker} to prevent internal race conditions.
 */
class KeyValueChannelStorage {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    storage;
    locker;
    constructor(storage, locker) {
        this.storage = storage;
        this.locker = locker;
    }
    async get(id) {
        const channel = await this.storage.get(encodeURIComponent(id));
        if (channel && this.isChannel(channel)) {
            if (typeof channel.endAt === 'number' && channel.endAt < Date.now()) {
                this.logger.info(`Notification channel ${id} has expired.`);
                await this.locker.withWriteLock(this.getLockKey(id), async () => {
                    await this.deleteChannel(channel);
                });
                return;
            }
            return channel;
        }
    }
    async getAll(topic) {
        const channels = await this.storage.get(encodeURIComponent(topic.path));
        if (Array.isArray(channels)) {
            return channels;
        }
        return [];
    }
    async add(channel) {
        const target = { path: channel.topic };
        return this.locker.withWriteLock(this.getLockKey(target), async () => {
            const channels = await this.getAll(target);
            await this.storage.set(encodeURIComponent(channel.id), channel);
            channels.push(channel.id);
            await this.storage.set(encodeURIComponent(channel.topic), channels);
        });
    }
    async update(channel) {
        return this.locker.withWriteLock(this.getLockKey(channel.id), async () => {
            const oldChannel = await this.storage.get(encodeURIComponent(channel.id));
            if (oldChannel) {
                if (!this.isChannel(oldChannel)) {
                    throw new InternalServerError_1.InternalServerError(`Trying to update ${channel.id} which is not a NotificationChannel.`);
                }
                if (channel.topic !== oldChannel.topic) {
                    throw new InternalServerError_1.InternalServerError(`Trying to change the topic of a notification channel ${channel.id}`);
                }
            }
            await this.storage.set(encodeURIComponent(channel.id), channel);
        });
    }
    async delete(id) {
        return this.locker.withWriteLock(this.getLockKey(id), async () => {
            const channel = await this.get(id);
            if (!channel) {
                return false;
            }
            await this.deleteChannel(channel);
            return true;
        });
    }
    /**
     * Utility function for deleting a specific {@link NotificationChannel} object.
     * Does not create a lock on the channel ID so should be wrapped in such a lock.
     */
    async deleteChannel(channel) {
        await this.locker.withWriteLock(this.getLockKey(channel.topic), async () => {
            const channels = await this.getAll({ path: channel.topic });
            const idx = channels.indexOf(channel.id);
            // If idx < 0 we have an inconsistency
            if (idx < 0) {
                this.logger.error(`Channel ${channel.id} was not found in the list of channels targeting ${channel.topic}.`);
                this.logger.error('This should not happen and indicates a data consistency issue.');
            }
            else {
                channels.splice(idx, 1);
                if (channels.length > 0) {
                    await this.storage.set(encodeURIComponent(channel.topic), channels);
                }
                else {
                    await this.storage.delete(encodeURIComponent(channel.topic));
                }
            }
            await this.storage.delete(encodeURIComponent(channel.id));
        });
    }
    isChannel(value) {
        return Boolean(value.id);
    }
    getLockKey(identifier) {
        return { path: `${typeof identifier === 'string' ? identifier : identifier.path}.notification-storage` };
    }
}
exports.KeyValueChannelStorage = KeyValueChannelStorage;
//# sourceMappingURL=KeyValueChannelStorage.js.map