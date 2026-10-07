import type { HttpRequest } from '../../../server/HttpRequest';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataParser } from './MetadataParser';
/**
 * Parses specific authorization schemes and stores their value as metadata.
 * The keys of the input `authMap` should be the schemes,
 * and the values the corresponding predicate that should be used to store the value in the metadata.
 * The scheme will be sliced off the value, after which it is used as the object in the metadata triple.
 *
 * This should be used for custom authorization schemes,
 * for things like OIDC tokens a {@link CredentialsExtractor} should be used.
 */
export declare class AuthorizationParser extends MetadataParser {
    private readonly authMap;
    constructor(authMap: Record<string, string>);
    handle(input: {
        request: HttpRequest;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
