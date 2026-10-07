import type { Operation } from '../../http/Operation';
import type { ResourceSet } from '../../storage/ResourceSet';
import type { IdentifierStrategy } from '../../util/identifiers/IdentifierStrategy';
import { ModesExtractor } from './ModesExtractor';
import type { AccessMap } from './Permissions';
/**
 * Returns the required access modes from the source {@link ModesExtractor}.
 * In case create permissions are required,
 * verifies if any of the containers permissions also need to be created
 * and adds the corresponding identifier/mode combinations.
 */
export declare class IntermediateCreateExtractor extends ModesExtractor {
    private readonly resourceSet;
    private readonly strategy;
    private readonly source;
    /**
     * Certain permissions depend on the existence of the target resource.
     * The provided {@link ResourceSet} will be used for that.
     *
     * @param resourceSet - {@link ResourceSet} that can verify the target resource existence.
     * @param strategy - {@link IdentifierStrategy} that will be used to determine parent containers.
     * @param source - The source {@link ModesExtractor}.
     */
    constructor(resourceSet: ResourceSet, strategy: IdentifierStrategy, source: ModesExtractor);
    canHandle(input: Operation): Promise<void>;
    handle(input: Operation): Promise<AccessMap>;
}
