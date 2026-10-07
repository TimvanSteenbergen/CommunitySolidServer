import type { Representation } from '../../http/representation/Representation';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Converts most major RDF serializations to `internal/quads`.
 *
 * Custom contexts can be defined to be used when parsing JSON-LD.
 * The keys of the object should be the URL of the context,
 * and the values the file path of the contexts to use when the JSON-LD parser would fetch the given context.
 * We use filepaths because embedding them directly into the configurations breaks Components.js.
 */
export declare class RdfToQuadConverter extends BaseTypedRepresentationConverter {
    private readonly documentLoader;
    constructor(contexts?: Record<string, string>);
    handle({ representation, identifier }: RepresentationConverterArgs): Promise<Representation>;
}
