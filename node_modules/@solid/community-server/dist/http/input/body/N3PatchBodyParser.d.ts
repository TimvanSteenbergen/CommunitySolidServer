import type { N3Patch } from '../../representation/N3Patch';
import type { BodyParserArgs } from './BodyParser';
import { BodyParser } from './BodyParser';
/**
 * Parses an N3 Patch document and makes sure it conforms to the specification requirements.
 * Requirements can be found at Solid Protocol, §5.3.1: https://solid.github.io/specification/protocol#n3-patch
 */
export declare class N3PatchBodyParser extends BodyParser {
    canHandle({ metadata }: BodyParserArgs): Promise<void>;
    handle({ request, metadata }: BodyParserArgs): Promise<N3Patch>;
    /**
     * Extracts the deletes/inserts/conditions from a solid:InsertDeletePatch entry.
     */
    private parsePatch;
    /**
     * Finds all quads in a where/deletes/inserts formula.
     * The returned quads will be updated so their graph is the default graph instead of the N3 reference to the formula.
     * Will error in case there are multiple instances of the subject/predicate combination.
     */
    private findQuads;
    /**
     * Finds all variables in a set of quads.
     */
    private findVariables;
    /**
     * Verifies if the delete/insert triples conform to the specification requirements:
     *  - They should not contain blank nodes.
     *  - They should not contain variables that do not occur in the conditions.
     */
    private verifyQuads;
}
