import type { RepresentationMetadata } from '../../http/representation/RepresentationMetadata';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { FileIdentifierMapper } from '../mapping/FileIdentifierMapper';
import type { Size } from './Size';
import type { SizeReporter } from './SizeReporter';
/**
 * SizeReporter that is used to calculate sizes of resources for a file based system.
 */
export declare class FileSizeReporter implements SizeReporter<string> {
    private readonly fileIdentifierMapper;
    private readonly ignoreFolders;
    private readonly rootFilePath;
    constructor(fileIdentifierMapper: FileIdentifierMapper, rootFilePath: string, ignoreFolders?: string[]);
    /** The FileSizeReporter will always return data in the form of bytes */
    getUnit(): string;
    /**
     * Returns the size of the given resource ( and its children ) in bytes
     */
    getSize(identifier: ResourceIdentifier): Promise<Size>;
    calculateChunkSize(chunk: string): Promise<number>;
    /** The estimated size of a resource in this reporter is simply the content-length header */
    estimateSize(metadata: RepresentationMetadata): Promise<number | undefined>;
    /**
     * Get the total size of a resource and its children if present
     *
     * @param fileLocation - the resource of which you want the total size of ( on disk )
     *
     * @returns a number specifying how many bytes are used by the resource
     */
    private getTotalSize;
}
