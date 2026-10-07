import type { Patch } from '../http/representation/Patch';
import type { Representation } from '../http/representation/Representation';
import type { RepresentationPreferences } from '../http/representation/RepresentationPreferences';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import { BaseActivityEmitter } from '../server/notifications/ActivityEmitter';
import type { Conditions } from './conditions/Conditions';
import type { ChangeMap, ResourceStore } from './ResourceStore';
/**
 * Store that notifies listeners of changes to its source
 * by emitting a `changed` event.
 */
export declare class MonitoringStore<T extends ResourceStore = ResourceStore> extends BaseActivityEmitter implements ResourceStore {
    private readonly source;
    constructor(source: T);
    hasResource(identifier: ResourceIdentifier): Promise<boolean>;
    getRepresentation(identifier: ResourceIdentifier, preferences: RepresentationPreferences, conditions?: Conditions): Promise<Representation>;
    addResource(container: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
    deleteResource(identifier: ResourceIdentifier, conditions?: Conditions): Promise<ChangeMap>;
    setRepresentation(identifier: ResourceIdentifier, representation: Representation, conditions?: Conditions): Promise<ChangeMap>;
    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions?: Conditions): Promise<ChangeMap>;
    private emitChanged;
    private isKnownActivity;
}
