import type { Quad } from '@rdfjs/types';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import { StorageDescriber } from './StorageDescriber';
/**
 * Adds a fixed set of triples to the storage description resource,
 * with the resource identifier as subject.
 *
 * This can be used to add descriptions that a storage always needs to have,
 * such as the `<> a pim:Storage` triple.
 */
export declare class StaticStorageDescriber extends StorageDescriber {
    private readonly terms;
    constructor(terms: Record<string, string | string[]>);
    handle(target: ResourceIdentifier): Promise<Quad[]>;
    private generateTriples;
}
