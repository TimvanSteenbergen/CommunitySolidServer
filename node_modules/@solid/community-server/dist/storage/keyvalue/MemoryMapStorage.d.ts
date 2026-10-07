import type { KeyValueStorage } from './KeyValueStorage';
/**
 * A {@link KeyValueStorage} which uses a JavaScript Map for internal storage.
 */
export declare class MemoryMapStorage<TValue> implements KeyValueStorage<string, TValue> {
    private readonly data;
    constructor();
    get(key: string): Promise<TValue | undefined>;
    has(key: string): Promise<boolean>;
    set(key: string, value: TValue): Promise<this>;
    delete(key: string): Promise<boolean>;
    entries(): AsyncIterableIterator<[string, TValue]>;
}
