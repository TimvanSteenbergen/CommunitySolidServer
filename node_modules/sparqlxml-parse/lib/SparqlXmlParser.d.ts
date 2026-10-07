import * as RDF from "@rdfjs/types";
/**
 * Parser for the SPARQL Query Results XML format.
 * @see https://www.w3.org/TR/rdf-sparql-XMLres/
 */
export declare class SparqlXmlParser {
    static SUPPORTED_VERSIONS: string[];
    private readonly dataFactory;
    private readonly prefixVariableQuestionMark?;
    private readonly parseUnsupportedVersions;
    constructor(settings?: ISettings);
    /**
     * If the given version is valid for this parser to handle.
     * @param version A version string.
     */
    isValidVersion(version: string): boolean;
    /**
     * Convert a SPARQL XML bindings response stream to a stream of bindings objects.
     *
     * The bindings stream will emit a 'variables' event that will contain
     * the array of variables (as RDF.Variable[]), as defined in the response head.
     *
     * @param {NodeJS.ReadableStream} sparqlResponseStream A SPARQL XML response stream.
     * @param version The version that was supplied as a media type parameter
     * @return {NodeJS.ReadableStream} A stream of bindings.
     */
    parseXmlResultsStream(sparqlResponseStream: NodeJS.ReadableStream, version?: string): NodeJS.ReadableStream;
    /**
     * Convert a SPARQL XML boolean response stream to a promise resolving to a boolean.
     * This will reject if the given response was not a valid boolean response.
     * @param {NodeJS.ReadableStream} sparqlResponseStream A SPARQL XML response stream.
     * @param version The version that was supplied as a media type parameter
     * @return {Promise<boolean>} The response boolean.
     */
    parseXmlBooleanStream(sparqlResponseStream: NodeJS.ReadableStream, version?: string): Promise<boolean>;
    private stackEquals;
    private stackBeginsWith;
}
/**
 * Constructor settings object interface for {@link SparqlXmlParser}.
 */
export interface ISettings {
    /**
     * A custom datafactory.
     */
    dataFactory?: RDF.DataFactory;
    /**
     * If variable names should be prefixed with a quotation mark.
     */
    prefixVariableQuestionMark?: boolean;
    /**
     * If no error should be emitted on unsupported versions.
     */
    parseUnsupportedVersions?: boolean;
}
/**
 * A bindings object.
 */
export interface IBindings {
    [key: string]: RDF.Term;
}
