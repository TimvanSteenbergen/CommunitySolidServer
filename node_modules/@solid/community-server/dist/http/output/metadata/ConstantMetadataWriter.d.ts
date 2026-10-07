import type { HttpResponse } from '../../../server/HttpResponse';
import { MetadataWriter } from './MetadataWriter';
/**
 * A {@link MetadataWriter} that takes a constant map of header names and values.
 */
export declare class ConstantMetadataWriter extends MetadataWriter {
    private readonly headers;
    constructor(headers: Record<string, string>);
    handle({ response }: {
        response: HttpResponse;
    }): Promise<void>;
}
