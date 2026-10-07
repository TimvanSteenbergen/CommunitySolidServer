import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { BaseFileIdentifierMapper } from './BaseFileIdentifierMapper';
import type { FileIdentifierMapperFactory, ResourceLink } from './FileIdentifierMapper';
/**
 * Supports the behaviour described in https://www.w3.org/DesignIssues/HTTPFilenameMapping.html
 * Determines content-type based on the file extension.
 * In case an identifier does not end on an extension matching its content-type,
 * the corresponding file will be appended with the correct extension, preceded by $.
 */
export declare class ExtensionBasedMapper extends BaseFileIdentifierMapper {
    private readonly customTypes;
    private readonly customExtensions;
    constructor(base: string, rootFilepath: string, customTypes?: Record<string, string>);
    protected mapUrlToDocumentPath(identifier: ResourceIdentifier, filePath: string, contentType?: string): Promise<ResourceLink>;
    protected getDocumentUrl(relative: string): Promise<string>;
    protected getContentTypeFromPath(filePath: string): Promise<string>;
    /**
     * Helper function that removes the internal extension, one starting with $., from the given path.
     * Nothing happens if no such extension is present.
     */
    protected stripExtension(path: string): string;
}
export declare class ExtensionBasedMapperFactory implements FileIdentifierMapperFactory<ExtensionBasedMapper> {
    create(base: string, rootFilePath: string): Promise<ExtensionBasedMapper>;
}
