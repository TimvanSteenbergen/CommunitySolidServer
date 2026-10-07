import type { NamedNode } from '@rdfjs/types';
import type { Logger } from '../../../logging/Logger';
import type { HttpRequest } from '../../../server/HttpRequest';
import type { RepresentationMetadata } from '../../representation/RepresentationMetadata';
import { MetadataParser } from './MetadataParser';
/**
 * Parses Link headers with a specific `rel` value and adds them as metadata with the given predicate.
 */
export declare class LinkRelParser extends MetadataParser {
    protected readonly logger: Logger;
    private readonly linkRelMap;
    constructor(linkRelMap: Record<string, LinkRelObject>);
    handle(input: {
        request: HttpRequest;
        metadata: RepresentationMetadata;
    }): Promise<void>;
}
/**
 * Represents the values that are parsed as metadata
 */
export declare class LinkRelObject {
    readonly value: NamedNode;
    readonly ephemeral: boolean;
    readonly allowList: string[] | undefined;
    /**
     * @param value - The value corresponding to the `rel` value that will be used as predicate in the metadata.
     * @param ephemeral - (Optional) Indicates whether it will be stored by the server.
     * @param allowList - (Optional) Contains the objects that are allowed to be used with the given predicate.
     */
    constructor(value: string, ephemeral?: boolean, allowList?: string[]);
    /**
     * Checks whether the object can be added to the metadata
     *
     * @param object - The link target.
     *
     * @returns a boolean to indicate whether it can be added to the metadata or not
     */
    private objectAllowed;
    /**
     * Adds the object to the metadata when it is allowed
     *
     * @param object - The link target.
     * @param metadata - Metadata of the resource.
     * @param logger - Logger
     */
    addToMetadata(object: string, metadata: RepresentationMetadata, logger: Logger): void;
}
