import type { Patch } from '../http/representation/Patch';
import type { Representation } from '../http/representation/Representation';
import type { RepresentationPreferences } from '../http/representation/RepresentationPreferences';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { Conditions } from './conditions/Conditions';
import type { ChangeMap, ResourceStore } from './ResourceStore';
import type { RouterRule } from './routing/RouterRule';
/**
 * Store that routes the incoming request to a specific store based on the stored ResourceRouter.
 * In case no store was found for one of the functions that take no data (GET/PATCH/DELETE),
 * a 404 will be thrown. In the other cases the error of the router will be thrown (which would probably be 400).
 */
export declare class RoutingResourceStore implements ResourceStore {
    private readonly rule;
    constructor(rule: RouterRule);
    hasResource(identifier: ResourceIdentifier): Promise<boolean>;
    getRepresentation(identifier: ResourceIdentifier, preferences: RepresentationPreferences, conditions?: Conditions): Promise<Representation>;
    addResource(container: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
    setRepresentation(identifier: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
    deleteResource(identifier: ResourceIdentifier, conditions?: Conditions): Promise<ChangeMap>;
    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions?: Conditions): Promise<ChangeMap>;
    private getStore;
}
