import type { Representation } from '../http/representation/Representation';
import type { RepresentationConverter } from '../storage/conversion/RepresentationConverter';
/**
 * Fetches an RDF dataset from the given URL.
 *
 * Response will be a Representation with content-type internal/quads.
 */
export declare function fetchDataset(url: string): Promise<Representation>;
/**
 * Converts a given Response (from a request that was already made) to  an RDF dataset.
 * In case the given Response object was already parsed its body can be passed along as a string.
 *
 * The converter will be used to convert the response body to RDF.
 *
 * Response will be a Representation with content-type internal/quads.
 */
export declare function responseToDataset(response: Response, converter: RepresentationConverter, body?: string): Promise<Representation>;
