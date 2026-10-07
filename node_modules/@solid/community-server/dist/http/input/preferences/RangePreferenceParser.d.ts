import type { HttpRequest } from '../../../server/HttpRequest';
import type { RepresentationPreferences } from '../../representation/RepresentationPreferences';
import { PreferenceParser } from './PreferenceParser';
/**
 * Parses the range header into range preferences.
 * If the range corresponds to a suffix-length range, it will be stored in `start` as a negative value.
 */
export declare class RangePreferenceParser extends PreferenceParser {
    handle({ request: { headers: { range } } }: {
        request: HttpRequest;
    }): Promise<RepresentationPreferences>;
}
