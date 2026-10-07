import type { HttpRequest } from '../../../server/HttpRequest';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataParser } from './MetadataParser';
/**
 * Converts the contents of the slug header to metadata.
 */
export declare class SlugParser extends MetadataParser {
    protected readonly logger: import("../../..").Logger;
    handle(input: {
        request: HttpRequest;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
