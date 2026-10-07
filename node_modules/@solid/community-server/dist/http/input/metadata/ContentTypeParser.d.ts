import type { HttpRequest } from '../../../server/HttpRequest';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataParser } from './MetadataParser';
/**
 * Parser for the `content-type` header.
 */
export declare class ContentTypeParser extends MetadataParser {
    handle(input: {
        request: HttpRequest;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
