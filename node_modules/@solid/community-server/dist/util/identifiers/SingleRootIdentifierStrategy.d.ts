import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { BaseIdentifierStrategy } from './BaseIdentifierStrategy';
/**
 * An IdentifierStrategy that assumes there is only 1 root and all other identifiers are made by appending to that root.
 */
export declare class SingleRootIdentifierStrategy extends BaseIdentifierStrategy {
    private readonly baseUrl;
    protected readonly logger: import("../..").Logger;
    constructor(baseUrl: string);
    supportsIdentifier(identifier: ResourceIdentifier): boolean;
    isRootContainer(identifier: ResourceIdentifier): boolean;
}
