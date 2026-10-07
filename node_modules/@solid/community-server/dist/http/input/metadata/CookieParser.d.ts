import type { HttpRequest } from '../../../server/HttpRequest';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataParser } from './MetadataParser';
/**
 * Parses the cookie header and stores their values as metadata.
 * The keys of the input `cookieMap` should be the cookie names,
 * and the values the corresponding predicate that should be used to store the value in the metadata.
 * The values of the cookies will be used as objects in the generated triples
 */
export declare class CookieParser extends MetadataParser {
    private readonly cookieMap;
    constructor(cookieMap: Record<string, string>);
    handle(input: {
        request: HttpRequest;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
