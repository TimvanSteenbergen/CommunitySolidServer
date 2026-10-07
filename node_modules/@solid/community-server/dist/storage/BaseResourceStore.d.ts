import type { Patch } from '../http/representation/Patch';
import type { Representation } from '../http/representation/Representation';
import type { RepresentationPreferences } from '../http/representation/RepresentationPreferences';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { Conditions } from './conditions/Conditions';
import type { ChangeMap, ResourceStore } from './ResourceStore';
/**
 * Base implementation of ResourceStore for implementers of custom stores.
 */
export declare class BaseResourceStore implements ResourceStore {
    hasResource(identifier: ResourceIdentifier): Promise<boolean>;
    getRepresentation(identifier: ResourceIdentifier, preferences: RepresentationPreferences, conditions?: Conditions): Promise<Representation>;
    setRepresentation(identifier: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
    addResource(container: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
    deleteResource(identifier: ResourceIdentifier, conditions?: Conditions): Promise<ChangeMap>;
    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions?: Conditions): Promise<ChangeMap>;
}
