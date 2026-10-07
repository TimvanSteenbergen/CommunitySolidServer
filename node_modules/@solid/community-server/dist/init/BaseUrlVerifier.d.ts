import type { KeyValueStorage } from '../storage/keyvalue/KeyValueStorage';
import { Initializer } from './Initializer';
/**
 * Stores the `baseUrl` value that was used to start the server
 * and warns the user in case it differs from the previous one.
 */
export declare class BaseUrlVerifier extends Initializer {
    private readonly baseUrl;
    private readonly storageKey;
    private readonly storage;
    private readonly logger;
    constructor(baseUrl: string, storageKey: string, storage: KeyValueStorage<string, string>);
    handle(): Promise<void>;
}
