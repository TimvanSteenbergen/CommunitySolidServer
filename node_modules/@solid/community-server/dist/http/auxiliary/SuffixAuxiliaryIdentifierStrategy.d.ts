import type { ResourceIdentifier } from '../representation/ResourceIdentifier';
import type { AuxiliaryIdentifierStrategy } from './AuxiliaryIdentifierStrategy';
/**
 * Helper class that uses a suffix to determine if a resource is an auxiliary resource or not.
 * Simple string matching is used, so the dot needs to be included if needed, e.g. ".acl".
 */
export declare class SuffixAuxiliaryIdentifierStrategy implements AuxiliaryIdentifierStrategy {
    protected readonly suffix: string;
    constructor(suffix: string);
    getAuxiliaryIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
    getAuxiliaryIdentifiers(identifier: ResourceIdentifier): ResourceIdentifier[];
    isAuxiliaryIdentifier(identifier: ResourceIdentifier): boolean;
    getSubjectIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
}
