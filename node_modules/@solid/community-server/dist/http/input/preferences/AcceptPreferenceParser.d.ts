import type { HttpRequest } from '../../../server/HttpRequest';
import type { RepresentationPreferences } from '../../representation/RepresentationPreferences';
import { PreferenceParser } from './PreferenceParser';
/**
 * Extracts preferences from the Accept-* headers from an incoming {@link HttpRequest}.
 * Supports Accept, Accept-Charset, Accept-Encoding, Accept-Language and Accept-DateTime.
 */
export declare class AcceptPreferenceParser extends PreferenceParser {
    handle({ request: { headers } }: {
        request: HttpRequest;
    }): Promise<RepresentationPreferences>;
}
