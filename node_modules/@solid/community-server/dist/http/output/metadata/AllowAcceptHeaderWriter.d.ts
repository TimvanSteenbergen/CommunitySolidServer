import type { HttpResponse } from '../../../server/HttpResponse';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataWriter } from './MetadataWriter';
/**
 * Generates Allow, Accept-Patch, Accept-Post, and Accept-Put headers.
 * The resulting values depend on the choses input methods and types.
 * The input metadata also gets used to remove methods from that list
 * if they are not valid in the given situation.
 */
export declare class AllowAcceptHeaderWriter extends MetadataWriter {
    private readonly supportedMethods;
    private readonly acceptTypes;
    constructor(supportedMethods: string[], acceptTypes: {
        patch?: string[];
        post?: string[];
        put?: string[];
    });
    handle(input: {
        response: HttpResponse;
        metadata: RepresentationMetadata;
    }): Promise<void>;
    /**
     * Starts from the stored set of methods and removes all those that are not allowed based on the metadata.
     */
    private filterAllowedMethods;
    /**
     * POST is only allowed on containers.
     */
    private isPostAllowed;
    /**
     * PUT is not allowed on description resources or existing containers.
     */
    private isPutAllowed;
    /**
     * PATCH is not allowed on containers.
     */
    private isPatchAllowed;
    /**
     * DELETE is allowed if the target exists,
     * is not a container or description resource,
     * or is an empty container that isn't a storage.
     *
     * Note that the identifier value check only works if the metadata is not about an error.
     */
    private isDeleteAllowed;
    /**
     * Generates the Allow header if required.
     * It only needs to get added for successful GET/HEAD requests, 404s, or 405s.
     * The spec only requires it for GET/HEAD requests and 405s.
     * In the case of other error messages we can't deduce what the request method was,
     * so we do not add the header as we don't have enough information.
     */
    private generateAllow;
    /**
     * Generates the Accept-[Method] headers if required.
     * Will be added if the Allow header was added, or in case of a 415 error.
     * Specific Accept-[Method] headers will only be added if the method is in the `methods` set.
     */
    private generateAccept;
}
