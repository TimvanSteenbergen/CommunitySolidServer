import type { ReadWriteLocker } from '../../util/locking/ReadWriteLocker';
import type { KeyValueStorage } from './KeyValueStorage';
/**
 * Uses a JSON file to store key/value pairs.
 */
export declare class JsonFileStorage implements KeyValueStorage<string, unknown> {
    private readonly filePath;
    private readonly locker;
    private readonly lockIdentifier;
    constructor(filePath: string, locker: ReadWriteLocker);
    get(key: string): Promise<unknown>;
    has(key: string): Promise<boolean>;
    set(key: string, value: unknown): Promise<this>;
    delete(key: string): Promise<boolean>;
    entries(): AsyncIterableIterator<[string, unknown]>;
    /**
     * Acquires the data in the JSON file while using a read lock.
     */
    private getJsonSafely;
    /**
     * Updates the data in the JSON file while using a write lock.
     *
     * @param updateFn - A function that updates the JSON object.
     *
     * @returns The return value of `updateFn`.
     */
    private updateJsonSafely;
    /**
     * Reads and parses the data from the JSON file (without locking).
     */
    private getJson;
}
