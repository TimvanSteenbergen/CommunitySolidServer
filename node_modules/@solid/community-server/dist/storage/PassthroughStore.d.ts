import type { Patch } from '../http/representation/Patch';
import type { Representation } from '../http/representation/Representation';
import type { RepresentationPreferences } from '../http/representation/RepresentationPreferences';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { Conditions } from './conditions/Conditions';
import type { ChangeMap, ResourceStore } from './ResourceStore';
/**
 * Store that calls the corresponding functions of the source Store.
 * Can be extended by stores that do not want to override all functions
 * by implementing a decorator pattern.
 */
export declare class PassthroughStore<T extends ResourceStore = ResourceStore> implements ResourceStore {
    protected readonly source: T;
    constructor(source: T);
    hasResource(identifier: ResourceIdentifier): Promise<boolean>;
    getRepresentation(identifier: ResourceIdentifier, preferences: RepresentationPreferences, conditions?: Conditions): Promise<Representation>;
    addResource(container: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
    deleteResource(identifier: ResourceIdentifier, conditions?: Conditions): Promise<ChangeMap>;
    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions?: Conditions): Promise<ChangeMap>;
    setRepresentation(identifier: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
}
