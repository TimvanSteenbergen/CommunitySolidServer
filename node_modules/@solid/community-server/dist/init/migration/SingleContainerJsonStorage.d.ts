import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { JsonResourceStorage } from '../../storage/keyvalue/JsonResourceStorage';
/**
 * A variant of a {@link JsonResourceStorage} where the `entries()` call
 * does not recursively iterate through all containers.
 * Only the documents that are found in the root container are returned.
 *
 * This class was created to support migration where different storages are nested in one main `.internal` container,
 * and we specifically want to only return entries of one storage.
 */
export declare class SingleContainerJsonStorage<T> extends JsonResourceStorage<T> {
    protected getResourceEntries(containerId: ResourceIdentifier): AsyncIterableIterator<[string, T]>;
}
