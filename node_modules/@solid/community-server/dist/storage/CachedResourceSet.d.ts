import type { ResourceIdentifier } from '../http/representation/ResourceIdentifier';
import type { ResourceSet } from './ResourceSet';
/**
 * Caches resource existence in a `WeakMap` tied to the `ResourceIdentifier` object.
 */
export declare class CachedResourceSet implements ResourceSet {
    private readonly source;
    private readonly cache;
    constructor(source: ResourceSet);
    hasResource(identifier: ResourceIdentifier): Promise<boolean>;
}
