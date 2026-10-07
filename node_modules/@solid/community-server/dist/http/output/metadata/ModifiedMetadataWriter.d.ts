import type { HttpResponse } from '../../../server/HttpResponse';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataWriter } from './MetadataWriter';
/**
 * A {@link MetadataWriter} that generates all the necessary headers related to the modification date of a resource.
 */
export declare class ModifiedMetadataWriter extends MetadataWriter {
    handle(input: {
        response: HttpResponse;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
