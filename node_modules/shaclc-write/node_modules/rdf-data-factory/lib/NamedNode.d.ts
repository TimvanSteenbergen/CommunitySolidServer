import type * as RDF from '@rdfjs/types';
/**
 * A term that contains an IRI.
 */
export declare class NamedNode<TIri extends string = string> implements RDF.NamedNode<TIri> {
    readonly termType = "NamedNode";
    readonly value: TIri;
    constructor(value: TIri);
    equals(other?: RDF.Term | null): boolean;
}
