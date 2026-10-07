import type { RepresentationMetadata } from '../../http/representation/RepresentationMetadata';
import type { Conditions } from './Conditions';
import type { ETagHandler } from './ETagHandler';
export interface BasicConditionsOptions {
    matchesETag?: string[];
    notMatchesETag?: string[];
    modifiedSince?: Date;
    unmodifiedSince?: Date;
}
/**
 * Stores all the relevant Conditions values and matches them based on RFC7232.
 */
export declare class BasicConditions implements Conditions {
    protected readonly eTagHandler: ETagHandler;
    readonly matchesETag?: string[];
    readonly notMatchesETag?: string[];
    readonly modifiedSince?: Date;
    readonly unmodifiedSince?: Date;
    constructor(eTagHandler: ETagHandler, options: BasicConditionsOptions);
    matchesMetadata(metadata?: RepresentationMetadata, strict?: boolean): boolean;
}
