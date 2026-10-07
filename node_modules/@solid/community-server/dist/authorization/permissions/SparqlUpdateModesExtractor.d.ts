import type { Operation } from '../../http/Operation';
import type { ResourceSet } from '../../storage/ResourceSet';
import { ModesExtractor } from './ModesExtractor';
import type { AccessMap } from './Permissions';
/**
 * Generates permissions for a SPARQL DELETE/INSERT body.
 * Updates with only an INSERT can be done with just append permissions,
 * while DELETEs require write permissions as well.
 */
export declare class SparqlUpdateModesExtractor extends ModesExtractor {
    private readonly resourceSet;
    /**
     * Certain permissions depend on the existence of the target resource.
     * The provided {@link ResourceSet} will be used for that.
     *
     * @param resourceSet - {@link ResourceSet} that can verify the target resource existence.
     */
    constructor(resourceSet: ResourceSet);
    canHandle({ body }: Operation): Promise<void>;
    handle({ body, target }: Operation): Promise<AccessMap>;
    private isSparql;
    private isSupported;
    private isDeleteInsert;
    private isNop;
    private hasConditions;
    private hasInserts;
    private hasDeletes;
}
