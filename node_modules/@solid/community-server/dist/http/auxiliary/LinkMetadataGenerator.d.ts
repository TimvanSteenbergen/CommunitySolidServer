import type { RepresentationMetadata } from '../representation/RepresentationMetadata';
import type { AuxiliaryIdentifierStrategy } from './AuxiliaryIdentifierStrategy';
import { MetadataGenerator } from './MetadataGenerator';
/**
 * Adds a link to the auxiliary resource when called on the subject resource.
 * Specifically: <subjectId> <link> <auxiliaryId> will be added.
 *
 * In case the input is metadata of an auxiliary resource no metadata will be added
 */
export declare class LinkMetadataGenerator extends MetadataGenerator {
    private readonly link;
    private readonly identifierStrategy;
    constructor(link: string, identifierStrategy: AuxiliaryIdentifierStrategy);
    handle(metadata: RepresentationMetadata): Promise<void>;
}
