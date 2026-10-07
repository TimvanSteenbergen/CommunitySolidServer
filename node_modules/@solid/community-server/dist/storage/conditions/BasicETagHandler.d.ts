import type { RepresentationMetadata } from '../../http/representation/RepresentationMetadata';
import type { ETagHandler } from './ETagHandler';
/**
 * Standard implementation of {@link ETagHandler}.
 * ETags are constructed by combining the last modified date with the content type of the representation.
 */
export declare class BasicETagHandler implements ETagHandler {
    getETag(metadata: RepresentationMetadata): string | undefined;
    matchesETag(metadata: RepresentationMetadata, eTag: string, strict: boolean): boolean;
    sameResourceState(eTag1: string, eTag2: string): boolean;
}
