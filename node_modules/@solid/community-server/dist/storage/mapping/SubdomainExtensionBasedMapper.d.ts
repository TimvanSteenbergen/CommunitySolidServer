import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { ExtensionBasedMapper } from './ExtensionBasedMapper';
/**
 * Extends the functionality of an {@link ExtensionBasedMapper} to support identifiers containing subdomains.
 * This is mostly only relevant in case you want to support multiple pods with subdomain identifiers
 * in a single ResourceStore.
 *
 * When converting to/from file paths, the subdomain is interpreted as a folder in the rootFilePath.
 * The rest of the path is then interpreted relative to that folder.
 * E.g. `http://alice.test.com/foo` results in the relative path `/alice/foo`.
 *
 * In case there is no subdomain in the URL, the `baseSubdomain` parameter is used instead.
 * E.g., if the `baseSubdomain` is "www", `http://test.com/foo` would result in the relative path `/www/foo`.
 * This means that there is no identifier that maps to the `rootFilePath` itself.
 * To prevent the possibility of 2 identifiers linking to the same file,
 * identifiers containing the default subdomain are rejected.
 * E.g., `http://www.test.com/foo` would result in a 403, even if `http://test.com/foo` exists.
 */
export declare class SubdomainExtensionBasedMapper extends ExtensionBasedMapper {
    private readonly baseSubdomain;
    private readonly regex;
    private readonly baseParts;
    constructor(base: string, rootFilepath: string, baseSubdomain?: string, customTypes?: Record<string, string>);
    protected getContainerUrl(relative: string): Promise<string>;
    protected getDocumentUrl(relative: string): Promise<string>;
    /**
     * Converts a relative path to a URL.
     * Examples assuming http://test.com/ is the base url and `www` the base subdomain:
     *  * /www/foo gives http://test.com/foo
     *  * /alice/foo/ gives http://alice.test.com/foo/
     */
    protected relativeToUrl(relative: string): string;
    /**
     * Gets the relative path as though the subdomain url is the base, and then prepends it with the subdomain.
     * Examples assuming http://test.com/ is the base url and `www` the base subdomain:
     *  * http://test.com/foo gives /www/foo
     *  * http://alice.test.com/foo/ gives /alice/foo/
     */
    protected getRelativePath(identifier: ResourceIdentifier): string;
}
