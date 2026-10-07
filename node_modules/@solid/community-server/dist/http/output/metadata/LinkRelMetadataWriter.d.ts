import type { HttpResponse } from '../../../server/HttpResponse';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataWriter } from './MetadataWriter';
/**
 * A {@link MetadataWriter} that takes a linking metadata predicates to Link header "rel" values.
 * The values of the objects will be put in a Link header with the corresponding "rel" value.
 */
export declare class LinkRelMetadataWriter extends MetadataWriter {
    private readonly linkRelMap;
    protected readonly logger: import("../../..").Logger;
    constructor(linkRelMap: Record<string, string>);
    handle(input: {
        response: HttpResponse;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
