import type { HttpResponse } from '../../../server/HttpResponse';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataWriter } from './MetadataWriter';
/**
 * Adds the `WWW-Authenticate` header with the injected value in case the response status code is 401.
 */
export declare class WwwAuthMetadataWriter extends MetadataWriter {
    private readonly auth;
    constructor(auth: string);
    handle(input: {
        response: HttpResponse;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
