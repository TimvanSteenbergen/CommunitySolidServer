import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { PromiseOrValue } from '../PromiseUtil';
import type { ReadWriteLocker } from './ReadWriteLocker';
import type { ResourceLocker } from './ResourceLocker';
/**
 * A {@link ReadWriteLocker} that gives no priority to read or write operations: both use the same lock.
 */
export declare class EqualReadWriteLocker implements ReadWriteLocker {
    protected readonly locker: ResourceLocker;
    constructor(locker: ResourceLocker);
    withReadLock<T>(identifier: ResourceIdentifier, whileLocked: () => PromiseOrValue<T>): Promise<T>;
    withWriteLock<T>(identifier: ResourceIdentifier, whileLocked: () => PromiseOrValue<T>): Promise<T>;
    /**
     * Acquires a new lock for the requested identifier.
     * Will resolve when the input function resolves.
     *
     * @param identifier - Identifier of resource that needs to be locked.
     * @param whileLocked - Function to resolve while the resource is locked.
     */
    protected withLock<T>(identifier: ResourceIdentifier, whileLocked: () => PromiseOrValue<T>): Promise<T>;
}
