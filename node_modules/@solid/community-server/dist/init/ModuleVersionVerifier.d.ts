import type { KeyValueStorage } from '../storage/keyvalue/KeyValueStorage';
import { Initializer } from './Initializer';
/**
 * This initializer simply writes the version number of the server to the storage.
 * This will be relevant in the future when we look into migration initializers.
 *
 * It automatically parses the version number from the `package.json`.
 */
export declare class ModuleVersionVerifier extends Initializer {
    private readonly storageKey;
    private readonly storage;
    constructor(storageKey: string, storage: KeyValueStorage<string, string>);
    handle(): Promise<void>;
}
