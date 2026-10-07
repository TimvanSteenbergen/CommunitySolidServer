import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { IdentifierGenerator } from '../../pods/generate/IdentifierGenerator';
import type { StorageLocationStrategy } from './StorageLocationStrategy';
/**
 * A {@link StorageLocationStrategy} to be used when the server has pods which each are a different storage.
 * The {@link IdentifierGenerator} that is used to generate URLs for the pods
 * is used here to determine what the root pod URL is.
 */
export declare class PodStorageLocationStrategy implements StorageLocationStrategy {
    private readonly generator;
    constructor(generator: IdentifierGenerator);
    getStorageIdentifier(identifier: ResourceIdentifier): Promise<ResourceIdentifier>;
}
