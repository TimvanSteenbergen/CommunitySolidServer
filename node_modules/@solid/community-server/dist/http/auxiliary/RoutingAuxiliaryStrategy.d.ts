import type { Representation } from '../representation/Representation';
import type { RepresentationMetadata } from '../representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../representation/ResourceIdentifier';
import type { AuxiliaryStrategy } from './AuxiliaryStrategy';
import { RoutingAuxiliaryIdentifierStrategy } from './RoutingAuxiliaryIdentifierStrategy';
/**
 * An {@link AuxiliaryStrategy} that combines multiple AuxiliaryStrategies into one.
 * Uses `isAuxiliaryIdentifier` to know which strategy to call for which call.
 *
 * `addMetadata` will either call all strategies if the input is the subject identifier,
 * or only the matching strategy if the input is an auxiliary identifier.
 */
export declare class RoutingAuxiliaryStrategy extends RoutingAuxiliaryIdentifierStrategy implements AuxiliaryStrategy {
    protected readonly sources: AuxiliaryStrategy[];
    constructor(sources: AuxiliaryStrategy[]);
    usesOwnAuthorization(identifier: ResourceIdentifier): boolean;
    isRequiredInRoot(identifier: ResourceIdentifier): boolean;
    addMetadata(metadata: RepresentationMetadata): Promise<void>;
    validate(representation: Representation): Promise<void>;
    protected getMatchingSource(identifier: ResourceIdentifier): AuxiliaryStrategy;
}
