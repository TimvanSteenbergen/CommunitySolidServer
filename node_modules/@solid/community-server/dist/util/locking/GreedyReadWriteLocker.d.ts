import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { KeyValueStorage } from '../../storage/keyvalue/KeyValueStorage';
import { BaseReadWriteLocker } from './BaseReadWriteLocker';
import type { ResourceLocker } from './ResourceLocker';
/**
 * A {@link BaseReadWriteLocker} that uses the same locker for the main lock and the count lock,
 * and uses a {@link KeyValueStorage} for keeping track of the counter.
 *
 * Since it is completely dependent on other implementations,
 * this locker is threadsafe if its inputs are as well.
 */
export declare class GreedyReadWriteLocker extends BaseReadWriteLocker {
    protected readonly storage: KeyValueStorage<string, number>;
    protected readonly readSuffix: string;
    protected readonly countSuffix: string;
    /**
     * @param locker - Used for creating read and write locks.
     * @param storage - Used for storing the amount of active read operations on a resource.
     * @param readSuffix - Used to generate the identifier for the lock that is applied when updating the counter.
     * @param countSuffix - Used to generate the identifier that will be used in the storage for storing the counter.
     */
    constructor(locker: ResourceLocker, storage: KeyValueStorage<string, number>, readSuffix?: string, countSuffix?: string);
    protected getCountLockIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
    /**
     * This key is used for storing the count of active read operations.
     */
    protected getCountKey(identifier: ResourceIdentifier): string;
    /**
     * Updates the count with the given modifier.
     * Creates the data if it didn't exist yet.
     * Deletes the data when the count reaches zero.
     */
    protected modifyCount(identifier: ResourceIdentifier, mod: number): Promise<number>;
}
