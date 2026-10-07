import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { BaseFileIdentifierMapper } from './BaseFileIdentifierMapper';
import type { ResourceLink } from './FileIdentifierMapper';
/**
 * A mapper that always returns a fixed content type for files.
 */
export declare class FixedContentTypeMapper extends BaseFileIdentifierMapper {
    protected readonly contentType: string;
    protected readonly pathSuffix: string;
    protected readonly urlSuffix: string;
    /**
     * @param base - Base URL.
     * @param rootFilepath - Base file path.
     * @param contentType - Fixed content type that will be used for all resources.
     * @param pathSuffix - An optional suffix that will be appended to all file paths.
     *                     Requested file paths without this suffix will be rejected.
     * @param urlSuffix - An optional suffix that will be appended to all URL.
     *                    Requested URLs without this suffix will be rejected.
     */
    constructor(base: string, rootFilepath: string, contentType: string, pathSuffix?: string, urlSuffix?: string);
    protected getContentTypeFromUrl(identifier: ResourceIdentifier, contentType?: string): Promise<string>;
    protected getContentTypeFromPath(): Promise<string>;
    mapUrlToDocumentPath(identifier: ResourceIdentifier, filePath: string, contentType?: string): Promise<ResourceLink>;
    protected getDocumentUrl(relative: string): Promise<string>;
}
