import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { HashMap } from './HashMap';
import { WrappedSetMultiMap } from './WrappedSetMultiMap';
/**
 * Converts a {@link ResourceIdentifier} into a string unique to that identifier.
 */
export declare function identifierHashFn(identifier: ResourceIdentifier): string;
/**
 * A specific implementation of {@link HashMap} where the key type is {@link ResourceIdentifier}.
 */
export declare class IdentifierMap<T> extends HashMap<ResourceIdentifier, T> {
    constructor(iterable?: Iterable<readonly [ResourceIdentifier, T]>);
}
/**
 * A specific implementation of {@link WrappedSetMultiMap} where the key type is {@link ResourceIdentifier}.
 */
export declare class IdentifierSetMultiMap<T> extends WrappedSetMultiMap<ResourceIdentifier, T> {
    constructor(iterable?: Iterable<readonly [ResourceIdentifier, T | ReadonlySet<T>]>);
}
