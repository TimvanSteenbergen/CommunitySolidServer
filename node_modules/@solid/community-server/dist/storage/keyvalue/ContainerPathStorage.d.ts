import type { KeyValueStorage } from './KeyValueStorage';
import { PassthroughKeyValueStorage } from './PassthroughKeyValueStorage';
/**
 * A {@link KeyValueStorage} that prepends a relative path to the key.
 * Leading slashes of the relative path are trimmed, and a trailing slash is added if needed.
 */
export declare class ContainerPathStorage<T> extends PassthroughKeyValueStorage<T> {
    protected readonly basePath: string;
    constructor(source: KeyValueStorage<string, T>, relativePath: string);
    entries(): AsyncIterableIterator<[string, T]>;
    protected toNewKey(key: string): string;
    protected toOriginalKey(path: string): string;
}
