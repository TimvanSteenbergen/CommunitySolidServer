import type { Operation } from '../../http/Operation';
import type { ResourceSet } from '../../storage/ResourceSet';
import type { IdentifierStrategy } from '../../util/identifiers/IdentifierStrategy';
import { ModesExtractor } from './ModesExtractor';
import type { AccessMap } from './Permissions';
/**
 * In case a resource is being deleted but does not exist,
 * the server response code depends on the access modes the agent has on the parent container.
 * In case the agent has read access on the parent container, a 404 should be returned,
 * otherwise it should be 401/403.
 *
 * This class adds support for this by requiring read access on the parent container
 * in case the target resource does not exist.
 */
export declare class DeleteParentExtractor extends ModesExtractor {
    private readonly source;
    private readonly resourceSet;
    private readonly identifierStrategy;
    constructor(source: ModesExtractor, resourceSet: ResourceSet, identifierStrategy: IdentifierStrategy);
    canHandle(operation: Operation): Promise<void>;
    handle(operation: Operation): Promise<AccessMap>;
}
