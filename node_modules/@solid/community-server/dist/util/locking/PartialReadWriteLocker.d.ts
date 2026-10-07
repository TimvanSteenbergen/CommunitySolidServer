import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { BaseReadWriteLocker } from './BaseReadWriteLocker';
import type { ResourceLocker } from './ResourceLocker';
/**
 * A {@link BaseReadWriteLocker} that stores the counter and its associated locks in memory.
 * The consequence of this is that multiple read requests are possible as long as they occur on the same worker thread.
 * A read request from a different worker thread will have to wait
 * until those from the current worker thread are finished.
 *
 * The main reason for this class is due to the file locker that we use only allowing locks to be released
 * by the same worker thread that acquired them.
 */
export declare class PartialReadWriteLocker extends BaseReadWriteLocker {
    private readonly readCount;
    constructor(locker: ResourceLocker);
    protected getCountLockIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
    protected modifyCount(identifier: ResourceIdentifier, mod: number): number;
}
