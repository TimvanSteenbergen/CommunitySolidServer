import type { Operation } from '../../http/Operation';
import type { ResourceSet } from '../../storage/ResourceSet';
import { ModesExtractor } from './ModesExtractor';
import type { AccessMap } from './Permissions';
/**
 * Extracts the required access modes from an N3 Patch.
 *
 * Solid, §5.3.1: "When ?conditions is non-empty, servers MUST treat the request as a Read operation.
 * When ?insertions is non-empty, servers MUST (also) treat the request as an Append operation.
 * When ?deletions is non-empty, servers MUST treat the request as a Read and Write operation."
 * https://solid.github.io/specification/protocol#n3-patch
 */
export declare class N3PatchModesExtractor extends ModesExtractor {
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
}
