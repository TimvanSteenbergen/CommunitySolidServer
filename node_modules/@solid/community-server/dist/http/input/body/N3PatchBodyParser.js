"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N3PatchBodyParser = void 0;
const n3_1 = require("n3");
const rdf_terms_1 = require("rdf-terms");
const ContentTypes_1 = require("../../../util/ContentTypes");
const BadRequestHttpError_1 = require("../../../util/errors/BadRequestHttpError");
const ErrorUtil_1 = require("../../../util/errors/ErrorUtil");
const UnprocessableEntityHttpError_1 = require("../../../util/errors/UnprocessableEntityHttpError");
const UnsupportedMediaTypeHttpError_1 = require("../../../util/errors/UnsupportedMediaTypeHttpError");
const StreamUtil_1 = require("../../../util/StreamUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const BodyParser_1 = require("./BodyParser");
const defaultGraph = n3_1.DataFactory.defaultGraph();
/**
 * Parses an N3 Patch document and makes sure it conforms to the specification requirements.
 * Requirements can be found at Solid Protocol, §5.3.1: https://solid.github.io/specification/protocol#n3-patch
 */
class N3PatchBodyParser extends BodyParser_1.BodyParser {
    async canHandle({ metadata }) {
        if (metadata.contentType !== ContentTypes_1.TEXT_N3) {
            throw new UnsupportedMediaTypeHttpError_1.UnsupportedMediaTypeHttpError('This parser only supports N3 Patch documents.');
        }
    }
    async handle({ request, metadata }) {
        const n3 = await (0, StreamUtil_1.readableToString)(request);
        const parser = new n3_1.Parser({ format: ContentTypes_1.TEXT_N3, baseIRI: metadata.identifier.value });
        let store;
        try {
            store = new n3_1.Store(parser.parse(n3));
        }
        catch (error) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid N3: ${(0, ErrorUtil_1.createErrorMessage)(error)}`, { cause: error });
        }
        // Solid, §5.3.1: "A patch resource MUST contain a triple ?patch rdf:type solid:InsertDeletePatch."
        // "The patch document MUST contain exactly one patch resource,
        // identified by one or more of the triple patterns described above, which all share the same ?patch subject."
        const patches = store.getSubjects(Vocabularies_1.RDF.terms.type, Vocabularies_1.SOLID.terms.InsertDeletePatch, defaultGraph);
        if (patches.length !== 1) {
            throw new UnprocessableEntityHttpError_1.UnprocessableEntityHttpError(`This patcher only supports N3 Patch documents with exactly 1 solid:InsertDeletePatch entry, but received ${patches.length}.`);
        }
        return {
            ...this.parsePatch(patches[0], store),
            binary: true,
            data: (0, StreamUtil_1.guardedStreamFrom)(n3),
            metadata,
            isEmpty: false,
        };
    }
    /**
     * Extracts the deletes/inserts/conditions from a solid:InsertDeletePatch entry.
     */
    parsePatch(patch, store) {
        // Solid, §5.3.1: "A patch resource MUST be identified by a URI or blank node, which we refer to as ?patch
        // in the remainder of this section."
        if (patch.termType !== 'NamedNode' && patch.termType !== 'BlankNode') {
            throw new UnprocessableEntityHttpError_1.UnprocessableEntityHttpError('An N3 Patch subject needs to be a blank or named node.');
        }
        // Extract all quads from the corresponding formulae
        const deletes = this.findQuads(store, patch, Vocabularies_1.SOLID.terms.deletes);
        const inserts = this.findQuads(store, patch, Vocabularies_1.SOLID.terms.inserts);
        const conditions = this.findQuads(store, patch, Vocabularies_1.SOLID.terms.where);
        // Make sure there are no forbidden combinations
        const conditionVars = this.findVariables(conditions);
        this.verifyQuads(deletes, conditionVars);
        this.verifyQuads(inserts, conditionVars);
        return { deletes, inserts, conditions };
    }
    /**
     * Finds all quads in a where/deletes/inserts formula.
     * The returned quads will be updated so their graph is the default graph instead of the N3 reference to the formula.
     * Will error in case there are multiple instances of the subject/predicate combination.
     */
    findQuads(store, subject, predicate) {
        const graphs = store.getObjects(subject, predicate, defaultGraph);
        if (graphs.length > 1) {
            throw new UnprocessableEntityHttpError_1.UnprocessableEntityHttpError(`An N3 Patch can have at most 1 ${predicate.value}.`);
        }
        if (graphs.length === 0) {
            return [];
        }
        // This might not return all quads in case of nested formulae,
        // but these are not allowed and will throw an error later when checking for blank nodes.
        // Another check would be needed in case blank nodes are allowed in the future.
        const quads = store.getQuads(null, null, null, graphs[0]);
        // Remove the graph references so they can be interpreted as standard triples
        // independent of the formula they were in.
        return quads.map((quad) => n3_1.DataFactory.quad(quad.subject, quad.predicate, quad.object, defaultGraph));
    }
    /**
     * Finds all variables in a set of quads.
     */
    findVariables(quads) {
        return new Set(quads.flatMap((quad) => (0, rdf_terms_1.getVariables)((0, rdf_terms_1.getTerms)(quad)))
            .map((variable) => variable.value));
    }
    /**
     * Verifies if the delete/insert triples conform to the specification requirements:
     *  - They should not contain blank nodes.
     *  - They should not contain variables that do not occur in the conditions.
     */
    verifyQuads(otherQuads, conditionVars) {
        for (const quad of otherQuads) {
            const terms = (0, rdf_terms_1.getTerms)(quad);
            const blankNodes = (0, rdf_terms_1.getBlankNodes)(terms);
            // Solid, §5.3.1: "The ?insertions and ?deletions formulae MUST NOT contain blank nodes."
            if (blankNodes.length > 0) {
                throw new UnprocessableEntityHttpError_1.UnprocessableEntityHttpError(`An N3 Patch delete/insert formula can not contain blank nodes.`);
            }
            const variables = (0, rdf_terms_1.getVariables)(terms);
            for (const variable of variables) {
                // Solid, §5.3.1: "The ?insertions and ?deletions formulae
                // MUST NOT contain variables that do not occur in the ?conditions formula."
                if (!conditionVars.has(variable.value)) {
                    throw new UnprocessableEntityHttpError_1.UnprocessableEntityHttpError(`An N3 Patch delete/insert formula can only contain variables found in the conditions formula.`);
                }
            }
        }
    }
}
exports.N3PatchBodyParser = N3PatchBodyParser;
//# sourceMappingURL=N3PatchBodyParser.js.map