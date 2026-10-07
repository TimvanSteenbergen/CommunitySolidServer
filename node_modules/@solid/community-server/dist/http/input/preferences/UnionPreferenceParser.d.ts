import { UnionHandler } from '../../../util/handlers/UnionHandler';
import type { RepresentationPreferences } from '../../representation/RepresentationPreferences';
import type { PreferenceParser } from './PreferenceParser';
/**
 * Combines the results of multiple {@link PreferenceParser}s.
 * Will throw an error if multiple parsers return a range as these can't logically be combined.
 */
export declare class UnionPreferenceParser extends UnionHandler<PreferenceParser> {
    constructor(parsers: PreferenceParser[]);
    protected combine(results: RepresentationPreferences[]): Promise<RepresentationPreferences>;
}
