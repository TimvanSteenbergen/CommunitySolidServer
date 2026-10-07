import type { Operation } from '../../http/Operation';
import type { ResourceSet } from '../../storage/ResourceSet';
import { ModesExtractor } from './ModesExtractor';
import type { AccessMap } from './Permissions';
/**
 * Adds the `create` access mode to the result of the source in case the target resource does not exist.
 */
export declare class CreateModesExtractor extends ModesExtractor {
    private readonly source;
    private readonly resourceSet;
    constructor(source: ModesExtractor, resourceSet: ResourceSet);
    canHandle(operation: Operation): Promise<void>;
    handle(operation: Operation): Promise<AccessMap>;
}
