import type { HttpResponse } from '../../server/HttpResponse';
import type { MetadataWriter } from './metadata/MetadataWriter';
import type { ResponseDescription } from './response/ResponseDescription';
import { ResponseWriter } from './ResponseWriter';
/**
 * Writes to an {@link HttpResponse} based on the incoming {@link ResponseDescription}.
 */
export declare class BasicResponseWriter extends ResponseWriter {
    protected readonly logger: import("../..").Logger;
    private readonly metadataWriter;
    constructor(metadataWriter: MetadataWriter);
    canHandle(input: {
        response: HttpResponse;
        result: ResponseDescription;
    }): Promise<void>;
    handle(input: {
        response: HttpResponse;
        result: ResponseDescription;
    }): Promise<void>;
}
