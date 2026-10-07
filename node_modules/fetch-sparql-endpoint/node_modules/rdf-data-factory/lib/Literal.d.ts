import type * as RDF from '@rdfjs/types';
/**
 * A term that represents an RDF literal,
 * containing a string with an optional language tag and optional direction
 * or datatype.
 */
export declare class Literal implements RDF.Literal {
    readonly termType = "Literal";
    readonly value: string;
    readonly language: string;
    readonly datatype: RDF.NamedNode;
    readonly direction: 'ltr' | 'rtl' | '';
    static readonly RDF_LANGUAGE_STRING: RDF.NamedNode;
    static readonly RDF_DIRECTIONAL_LANGUAGE_STRING: RDF.NamedNode;
    static readonly XSD_STRING: RDF.NamedNode;
    constructor(value: string, languageOrDatatype?: string | RDF.NamedNode | RDF.DirectionalLanguage);
    equals(other?: RDF.Term | null): boolean;
}
