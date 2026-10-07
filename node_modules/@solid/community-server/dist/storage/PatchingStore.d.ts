import type { Patch } from '../http/representation/Patch';
import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { Conditions } from './conditions/Conditions';
import { PassthroughStore } from './PassthroughStore';
import type { PatchHandler } from './patch/PatchHandler';
import type { ChangeMap, ResourceStore } from './ResourceStore';
/**
 * {@link ResourceStore} using decorator pattern for the `modifyResource` function.
 * If the original store supports the {@link Patch}, behaviour will be identical,
 * otherwise the {@link PatchHandler} will be called instead.
 */
export declare class PatchingStore<T extends ResourceStore = ResourceStore> extends PassthroughStore<T> {
    private readonly patchHandler;
    constructor(source: T, patchHandler: PatchHandler);
    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions?: Conditions): Promise<ChangeMap>;
}
