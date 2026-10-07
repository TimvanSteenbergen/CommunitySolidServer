import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { KeyValueStorage } from '../keyvalue/KeyValueStorage';
import type { ResourceStore } from '../ResourceStore';
import { RouterRule } from './RouterRule';
/**
 * Routes requests based on their base url.
 * Checks if any of the stored base URLs match the request identifier.
 * If there are no matches the base store will be returned if one was configured.
 *
 * Part of the dynamic pod creation.
 * Uses the identifiers that were added to the routing storage.
 *
 * @see {@link TemplatedPodGenerator}, {@link ConfigPodInitializer}, {@link ConfigPodManager}
 */
export declare class BaseUrlRouterRule extends RouterRule {
    private readonly baseStore?;
    private readonly stores;
    constructor(stores: KeyValueStorage<string, ResourceStore>, baseStore?: ResourceStore);
    handle({ identifier }: {
        identifier: ResourceIdentifier;
    }): Promise<ResourceStore>;
    /**
     * Finds the store whose base url key is contained in the given identifier.
     */
    private findStore;
}
