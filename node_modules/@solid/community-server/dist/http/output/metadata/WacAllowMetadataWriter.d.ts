import type { HttpResponse } from '../../../server/HttpResponse';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataWriter } from './MetadataWriter';
/**
 * Add the necessary WAC-Allow header values.
 * Solid, §10.1: "Servers exposing client’s access privileges on a resource URL MUST advertise
 * by including the WAC-Allow HTTP header in the response of HTTP HEAD and GET requests."
 * https://solid.github.io/specification/protocol#web-access-control
 */
export declare class WacAllowMetadataWriter extends MetadataWriter {
    handle(input: {
        response: HttpResponse;
        metadata: RepresentationMetadata;
    }): Promise<void>;
    private aclToPermission;
    private createAccessParam;
}
