import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { StorageLocationStrategy } from './StorageLocationStrategy';
/**
 * A {@link StorageLocationStrategy} to be used when the server has one storage in the root container of the server.
 */
export declare class RootStorageLocationStrategy implements StorageLocationStrategy {
    private readonly root;
    constructor(baseUrl: string);
    getStorageIdentifier(): Promise<ResourceIdentifier>;
}
