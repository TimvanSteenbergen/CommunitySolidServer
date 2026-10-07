import type { HttpResponse } from '../../../server/HttpResponse';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataWriter } from './MetadataWriter';
/**
 * A {@link MetadataWriter} that takes a map directly converting metadata predicates to headers.
 * The header value(s) will be the same as the corresponding object value(s).
 */
export declare class MappedMetadataWriter extends MetadataWriter {
    private readonly headerMap;
    constructor(headerMap: Record<string, string>);
    handle(input: {
        response: HttpResponse;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
