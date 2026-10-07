import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { IdentifierGenerator } from './IdentifierGenerator';
/**
 * Generates identifiers by using the name as a subdomain on the base URL.
 * Non-alphanumeric characters will be replaced with `-`.
 *
 * When extracting the pod, the base URl is also seen as a pod as there is no issue of nested containers here.
 */
export declare class SubdomainIdentifierGenerator implements IdentifierGenerator {
    private readonly baseParts;
    constructor(baseUrl: string);
    generate(name: string): ResourceIdentifier;
    extractPod(identifier: ResourceIdentifier): ResourceIdentifier;
}
