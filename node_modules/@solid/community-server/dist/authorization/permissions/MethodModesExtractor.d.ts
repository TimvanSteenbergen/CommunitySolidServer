import type { Operation } from '../../http/Operation';
import type { ResourceSet } from '../../storage/ResourceSet';
import { ModesExtractor } from './ModesExtractor';
import type { AccessMap } from './Permissions';
/**
 * Generates permissions for the base set of methods that always require the same permissions.
 * Specifically: GET, HEAD, POST, PUT and DELETE.
 */
export declare class MethodModesExtractor extends ModesExtractor {
    private readonly resourceSet;
    /**
     * Certain permissions depend on the existence of the target resource.
     * The provided {@link ResourceSet} will be used for that.
     *
     * @param resourceSet - {@link ResourceSet} that can verify the target resource existence.
     */
    constructor(resourceSet: ResourceSet);
    canHandle({ method }: Operation): Promise<void>;
    handle({ method, target }: Operation): Promise<AccessMap>;
}
