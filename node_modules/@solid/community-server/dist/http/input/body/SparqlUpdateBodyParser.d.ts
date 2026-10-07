import type { SparqlUpdatePatch } from '../../representation/SparqlUpdatePatch';
import type { BodyParserArgs } from './BodyParser';
import { BodyParser } from './BodyParser';
/**
 * {@link BodyParser} that supports `application/sparql-update` content.
 * Will convert the incoming update string to algebra in a {@link SparqlUpdatePatch}.
 */
export declare class SparqlUpdateBodyParser extends BodyParser {
    protected readonly logger: import("../../..").Logger;
    canHandle({ metadata }: BodyParserArgs): Promise<void>;
    handle({ request, metadata }: BodyParserArgs): Promise<SparqlUpdatePatch>;
}
