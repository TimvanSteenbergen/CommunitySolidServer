import type { HttpResponse } from '../../../server/HttpResponse';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataWriter } from './MetadataWriter';
/**
 * Generates the necessary `Set-Cookie` header if a cookie value is detected in the metadata.
 * The keys of the input `cookieMap` should be the URIs of the predicates
 * used in the metadata when the object is a cookie value.
 * The value of the map are objects that contain the name of the cookie,
 * and the URI that is used to store the expiration date in the metadata, if any.
 * If no expiration date is found in the metadata, none will be set for the cookie,
 * causing it to be a session cookie.
 */
export declare class CookieMetadataWriter extends MetadataWriter {
    private readonly cookieMap;
    constructor(cookieMap: Record<string, {
        name: string;
        expirationUri?: string;
    }>);
    handle(input: {
        response: HttpResponse;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
