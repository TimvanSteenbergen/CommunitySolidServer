import type { Representation } from '../../http/representation/Representation';
import type { IdentifierStrategy } from '../../util/identifiers/IdentifierStrategy';
import type { TemplateEngine } from '../../util/templates/TemplateEngine';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * A {@link RepresentationConverter} that creates a templated representation of a container.
 */
export declare class ContainerToTemplateConverter extends BaseTypedRepresentationConverter {
    private readonly identifierStrategy;
    private readonly templateEngine;
    private readonly contentType;
    constructor(templateEngine: TemplateEngine, contentType: string, identifierStrategy: IdentifierStrategy);
    canHandle(args: RepresentationConverterArgs): Promise<void>;
    handle({ identifier, representation }: RepresentationConverterArgs): Promise<Representation>;
    /**
     * Collects the children of the container as simple objects.
     */
    private getChildResources;
    /**
     * Collects the ancestors of the container as simple objects.
     */
    private getParentContainers;
    /**
     * Derives a short name for the given resource.
     */
    private getLocalName;
}
