import type { Representation } from '../../http/representation/Representation';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { ResourceStore } from '../ResourceStore';
import type { PreferenceSupport } from './PreferenceSupport';
import { RouterRule } from './RouterRule';
export interface ConvertingStoreEntry {
    store: ResourceStore;
    supportChecker: PreferenceSupport;
}
/**
 * Rule that directs requests based on how the data would need to be converted.
 * In case the given converter can convert the data to the requested type,
 * it will be directed to the `convertStore`.
 * Otherwise the `defaultStore` will be chosen.
 *
 * In case there is no data and only an identifier the `defaultStore` will be checked
 * if it contains the given identifier.
 * If not, the `convertStore` will be returned.
 */
export declare class ConvertingRouterRule extends RouterRule {
    private readonly typedStores;
    private readonly defaultStore;
    constructor(typedStores: ConvertingStoreEntry[], defaultStore: ResourceStore);
    handle(input: {
        identifier: ResourceIdentifier;
        representation?: Representation;
    }): Promise<ResourceStore>;
    /**
     * Helper function that runs the given callback function for all the stores
     * and returns the first one that does not throw an error.
     *
     * Returns the default store if no match was found.
     */
    private findStore;
}
