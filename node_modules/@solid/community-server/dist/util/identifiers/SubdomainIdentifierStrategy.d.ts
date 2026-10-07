import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { BaseIdentifierStrategy } from './BaseIdentifierStrategy';
/**
 * An IdentifierStrategy that interprets all subdomains of the given base URL as roots.
 */
export declare class SubdomainIdentifierStrategy extends BaseIdentifierStrategy {
    private readonly baseUrl;
    private readonly regex;
    protected readonly logger: import("../..").Logger;
    constructor(baseUrl: string);
    supportsIdentifier(identifier: ResourceIdentifier): boolean;
    isRootContainer(identifier: ResourceIdentifier): boolean;
}
