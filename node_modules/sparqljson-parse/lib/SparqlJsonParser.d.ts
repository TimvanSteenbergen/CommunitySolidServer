import * as RDF from "@rdfjs/types";
/**
 * Parser for the SPARQL 1.1 Query Results JSON format.
 * @see https://www.w3.org/TR/sparql11-results-json/
 */
export declare class SparqlJsonParser {
    static SUPPORTED_VERSIONS: string[];
    private readonly dataFactory;
    private readonly prefixVariableQuestionMark?;
    private readonly suppressMissingStreamResultsError;
    private readonly parseUnsupportedVersions;
    constructor(settings?: ISettings);
    /**
     * If the given version is valid for this parser to handle.
     * @param version A version string.
     */
    isValidVersion(version: string): boolean;
    /**
     * Convert a SPARQL JSON bindings response to an array of bindings objects.
     * @param sparqlResponse A SPARQL JSON response.
     * @param version The version that was supplied as a media type parameter
     * @return {IBindings[]} An array of bindings.
     */
    parseJsonResults(sparqlResponse: any, version?: string): IBindings[];
    /**
     * Convert a SPARQL JSON bindings response stream to a stream of bindings objects.
     *
     * The bindings stream will emit a 'variables' event that will contain
     * the array of variables (as RDF.Variable[]), as defined in the response head.
     *
     * @param {NodeJS.ReadableStream} sparqlResponseStream A SPARQL JSON response stream.
     * @param version The version that was supplied as a media type parameter
     * @return {NodeJS.ReadableStream} A stream of bindings.
     */
    parseJsonResultsStream(sparqlResponseStream: NodeJS.ReadableStream, version?: string): NodeJS.ReadableStream;
    /**
     * Convert a SPARQL JSON result binding to a bindings object.
     * @param rawBindings A SPARQL JSON result binding.
     * @return {IBindings} A bindings object.
     */
    parseJsonBindings(rawBindings: any): IBindings;
    /**
     * Convert a SPARQL JSON result value to an RDF term.
     * @param rawValue A SPARQL JSON result value
     * @return {RDF.Term} An RDF term.
     */
    parseJsonValue(rawValue: any): RDF.Term;
    /**
     * Convert a SPARQL JSON boolean response to a boolean.
     * This will throw an error if the given reponse was not a valid boolean response.
     * @param sparqlResponse A SPARQL JSON response.
     * @param version The version that was supplied as a media type parameter
     * @return {IBindings[]} An array of bindings.
     */
    parseJsonBoolean(sparqlResponse: any, version?: string): boolean;
    /**
     * Convert a SPARQL JSON boolean response stream to a promise resolving to a boolean.
     * This will reject if the given reponse was not a valid boolean response.
     * @param {NodeJS.ReadableStream} sparqlResponseStream A SPARQL JSON response stream.
     * @param version The version that was supplied as a media type parameter
     * @return {Promise<boolean>} The response boolean.
     */
    parseJsonBooleanStream(sparqlResponseStream: NodeJS.ReadableStream, version?: string): Promise<boolean>;
}
/**
 * Constructor settings object interface for {@link SparqlJsonParser}.
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
     * If the error about missing results in a result stream should be suppressed.
     */
    suppressMissingStreamResultsError?: boolean;
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
