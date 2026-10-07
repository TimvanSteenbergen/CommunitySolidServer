import type { Representation } from '../representation/Representation';
import type { RepresentationMetadata } from '../representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../representation/ResourceIdentifier';
import type { AuxiliaryIdentifierStrategy } from './AuxiliaryIdentifierStrategy';
import type { AuxiliaryStrategy } from './AuxiliaryStrategy';
import type { MetadataGenerator } from './MetadataGenerator';
import type { Validator } from './Validator';
/**
 * An {@link AuxiliaryStrategy} that provides its functionality through the combination of
 * an {@link AuxiliaryIdentifierStrategy}, {@link MetadataGenerator} and {@link Validator}.
 */
export declare class ComposedAuxiliaryStrategy implements AuxiliaryStrategy {
    private readonly identifierStrategy;
    private readonly metadataGenerator?;
    private readonly validator?;
    private readonly ownAuthorization;
    private readonly requiredInRoot;
    constructor(identifierStrategy: AuxiliaryIdentifierStrategy, metadataGenerator?: MetadataGenerator, validator?: Validator, ownAuthorization?: boolean, requiredInRoot?: boolean);
    getAuxiliaryIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
    getAuxiliaryIdentifiers(identifier: ResourceIdentifier): ResourceIdentifier[];
    isAuxiliaryIdentifier(identifier: ResourceIdentifier): boolean;
    getSubjectIdentifier(identifier: ResourceIdentifier): ResourceIdentifier;
    usesOwnAuthorization(): boolean;
    isRequiredInRoot(): boolean;
    addMetadata(metadata: RepresentationMetadata): Promise<void>;
    validate(representation: Representation): Promise<void>;
}
