import type { KeyValueStorage } from './KeyValueStorage';
import { PassthroughKeyValueStorage } from './PassthroughKeyValueStorage';
/**
 * Encodes the input key with base64 encoding,
 * to make sure there are no invalid or special path characters.
 */
export declare class Base64EncodingStorage<T> extends PassthroughKeyValueStorage<T> {
    constructor(source: KeyValueStorage<string, T>);
    protected toNewKey(key: string): string;
    protected toOriginalKey(key: string): string;
}
