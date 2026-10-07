import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { IdentifierGenerator } from './IdentifierGenerator';
/**
 * Generates identifiers by appending the name to a stored base identifier.
 * Non-alphanumeric characters will be replaced with `-`.
 */
export declare class SuffixIdentifierGenerator implements IdentifierGenerator {
    private readonly base;
    constructor(base: string);
    generate(name: string): ResourceIdentifier;
    extractPod(identifier: ResourceIdentifier): ResourceIdentifier;
}
