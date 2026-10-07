"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N3Patcher = void 0;
const rdf_terms_1 = require("rdf-terms");
const N3Patch_1 = require("../../http/representation/N3Patch");
const LogUtil_1 = require("../../logging/LogUtil");
const ConflictHttpError_1 = require("../../util/errors/ConflictHttpError");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const QuadUtil_1 = require("../../util/QuadUtil");
const RepresentationPatcher_1 = require("./RepresentationPatcher");
/**
 * Applies an N3 Patch to a representation, or creates a new one if required.
 * Follows all the steps from Solid, §5.3.1: https://solid.github.io/specification/protocol#n3-patch
 */
class N3Patcher extends RepresentationPatcher_1.RepresentationPatcher {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor() {
        super();
    }
    async canHandle({ patch }) {
        if (!(0, N3Patch_1.isN3Patch)(patch)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only N3 Patch updates are supported');
        }
    }
    async handle(input) {
        if (!input.representation) {
            throw new InternalServerError_1.InternalServerError('Patcher requires a representation as input.');
        }
        const store = input.representation.dataset;
        const patch = input.patch;
        // No work to be done if the patch is empty
        if (patch.deletes.length === 0 && patch.inserts.length === 0 && patch.conditions.length === 0) {
            this.logger.debug('Empty patch, returning input.');
            return input.representation;
        }
        await this.patch({
            identifier: input.identifier,
            patch,
            store,
        });
        return input.representation;
    }
    /**
     * Applies the given N3Patch to the store.
     * First the conditions are applied to find the necessary bindings,
     * which are then applied to generate the triples that need to be deleted and inserted.
     * After that the delete and insert operations are applied.
     */
    async patch({ identifier, patch, store }) {
        this.logger.debug(`${store.size} quads in ${identifier.path}.`);
        const { deletes, inserts } = await this.applyConditions(patch, identifier, store);
        // Apply deletes
        if (deletes.length > 0) {
            // There could potentially be duplicates after applying conditions,
            // which would result in an incorrect count.
            const uniqueDeletes = (0, QuadUtil_1.uniqueQuads)(deletes);
            // Solid, §5.3.1: "The triples resulting from ?deletions are to be removed from the RDF dataset."
            const oldSize = store.size;
            store.removeQuads(uniqueDeletes);
            // Solid, §5.3.1: "If the set of triples resulting from ?deletions is non-empty and the dataset
            // does not contain all of these triples, the server MUST respond with a 409 status code."
            if (oldSize - store.size !== uniqueDeletes.length) {
                throw new ConflictHttpError_1.ConflictHttpError('The document does not contain all triples the N3 Patch requests to delete, which is required for patching.');
            }
            this.logger.debug(`Deleted ${oldSize - store.size} quads from ${identifier.path}.`);
        }
        // Solid, §5.3.1: "The triples resulting from ?insertions are to be added to the RDF dataset,
        // with each blank node from ?insertions resulting in a newly created blank node."
        store.addQuads(inserts);
        this.logger.debug(`${store.size} total quads after patching ${identifier.path}.`);
        return store;
    }
    /**
     * Creates a new N3Patch where the conditions of the provided patch parameter are applied to its deletes and inserts.
     * Also does the necessary checks to make sure the conditions are valid for the given dataset.
     */
    async applyConditions(patch, identifier, source) {
        const { conditions } = patch;
        let { deletes, inserts } = patch;
        if (conditions.length > 0) {
            // Solid, §5.3.1: "If ?conditions is non-empty, find all (possibly empty) variable mappings
            // such that all of the resulting triples occur in the dataset."
            const bindings = (0, QuadUtil_1.solveBgp)(conditions, source);
            // Solid, §5.3.1: "If no such mapping exists, or if multiple mappings exist,
            // the server MUST respond with a 409 status code."
            if (bindings.length === 0) {
                throw new ConflictHttpError_1.ConflictHttpError('The document does not contain any matches for the N3 Patch solid:where condition.');
            }
            if (bindings.length > 1) {
                throw new ConflictHttpError_1.ConflictHttpError('The document contains multiple matches for the N3 Patch solid:where condition, which is not allowed.');
            }
            // Apply bindings to deletes/inserts
            deletes = deletes.map((quad) => (0, rdf_terms_1.mapTerms)(quad, (term) => term.termType === 'Variable' ? bindings[0][term.value] : term));
            inserts = inserts.map((quad) => (0, rdf_terms_1.mapTerms)(quad, (term) => term.termType === 'Variable' ? bindings[0][term.value] : term));
        }
        return {
            ...patch,
            deletes,
            inserts,
            conditions: [],
        };
    }
}
exports.N3Patcher = N3Patcher;
//# sourceMappingURL=N3Patcher.js.map