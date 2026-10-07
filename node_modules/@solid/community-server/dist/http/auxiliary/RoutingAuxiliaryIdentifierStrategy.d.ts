import type { ResourceIdentifier } from '../representation/ResourceIdentifier';
import type { AuxiliaryIdentifierStrategy } from './AuxiliaryIdentifierStrategy';
/**
 * An {@link AuxiliaryIdentifierStrategy} that combines multiple AuxiliaryIdentifierStrategies into one.
 * Uses `isAuxiliaryIdentifier` to know which strategy to route to.
 */
export declare class RoutingAuxiliaryIdentifierStrategy implements AuxiliaryIdentifierStrategy {
    protected readonly sources: AuxiliaryIdentifierStrategy[];
    constructor(sources: AuxiliaryIdentifierStrategy[]);
    getAuxiliaryIdentifier(): never;
    getAuxiliaryIdentifiers(identifier: ResourceIdentifier): ResourceIdentifier[];
    isAuxiliaryIdentifier(identifier: ResourceIdentifier): boolean;
    getSubjectIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
    protected getMatchingSource(identifier: ResourceIdentifier): AuxiliaryIdentifierStrategy;
}
