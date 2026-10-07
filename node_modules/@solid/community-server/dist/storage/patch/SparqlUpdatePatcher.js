"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparqlUpdatePatcher = void 0;
const query_sparql_1 = require("@comunica/query-sparql");
const n3_1 = require("n3");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const LogUtil_1 = require("../../logging/LogUtil");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const StreamUtil_1 = require("../../util/StreamUtil");
const RepresentationPatcher_1 = require("./RepresentationPatcher");
/**
 * Supports application/sparql-update PATCH requests on RDF resources.
 *
 * Only DELETE/INSERT updates without variables are supported.
 */
class SparqlUpdatePatcher extends RepresentationPatcher_1.RepresentationPatcher {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    engine;
    constructor() {
        super();
        this.engine = new query_sparql_1.QueryEngine();
    }
    async canHandle({ patch }) {
        if (!this.isSparqlUpdate(patch)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only SPARQL update patches are supported');
        }
    }
    async handle({ identifier, patch, representation }) {
        // Verify the patch
        const op = patch.algebra;
        if (!representation) {
            throw new InternalServerError_1.InternalServerError('Patcher requires a representation as input.');
        }
        const store = representation.dataset;
        // In case of a NOP we can skip everything
        if (op.type === sparqlalgebrajs_1.Algebra.types.NOP) {
            return representation;
        }
        this.validateUpdate(op);
        await this.patch({
            identifier,
            patch,
            store,
        });
        return representation;
    }
    isSparqlUpdate(patch) {
        return typeof patch.algebra === 'object';
    }
    isDeleteInsert(op) {
        return op.type === sparqlalgebrajs_1.Algebra.types.DELETE_INSERT;
    }
    isComposite(op) {
        return op.type === sparqlalgebrajs_1.Algebra.types.COMPOSITE_UPDATE;
    }
    /**
     * Checks if the input operation is of a supported type (DELETE/INSERT or composite of those)
     */
    validateUpdate(op) {
        if (this.isDeleteInsert(op)) {
            this.validateDeleteInsert(op);
        }
        else if (this.isComposite(op)) {
            this.validateComposite(op);
        }
        else {
            this.logger.warn(`Unsupported operation: ${op.type}`);
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only DELETE/INSERT SPARQL update operations are supported');
        }
    }
    /**
     * Checks if the input DELETE/INSERT is supported.
     * This means: no GRAPH statements, no DELETE WHERE containing terms of type Variable.
     */
    validateDeleteInsert(op) {
        const def = n3_1.DataFactory.defaultGraph();
        const deletes = op.delete ?? [];
        const inserts = op.insert ?? [];
        if (!deletes.every((pattern) => pattern.graph.equals(def))) {
            this.logger.warn('GRAPH statement in DELETE clause');
            throw new NotImplementedHttpError_1.NotImplementedHttpError('GRAPH statements are not supported');
        }
        if (!inserts.every((pattern) => pattern.graph.equals(def))) {
            this.logger.warn('GRAPH statement in INSERT clause');
            throw new NotImplementedHttpError_1.NotImplementedHttpError('GRAPH statements are not supported');
        }
        if (!(typeof op.where === 'undefined' || op.where.type === sparqlalgebrajs_1.Algebra.types.BGP)) {
            this.logger.warn('Non-BGP WHERE statements are not supported');
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Non-BGP WHERE statements are not supported');
        }
    }
    /**
     * Checks if the composite update only contains supported update components.
     */
    validateComposite(op) {
        for (const update of op.updates) {
            this.validateUpdate(update);
        }
    }
    /**
     * Apply the given algebra operation to the given identifier.
     */
    async patch({ identifier, patch, store }) {
        const result = store;
        this.logger.debug(`${result.size} quads in ${identifier.path}.`);
        // Run the query through Comunica
        const sparql = await (0, StreamUtil_1.readableToString)(patch.data);
        await this.engine.queryVoid(sparql, { sources: [result], baseIRI: identifier.path });
        this.logger.debug(`${result.size} quads will be stored to ${identifier.path}.`);
        return result;
    }
}
exports.SparqlUpdatePatcher = SparqlUpdatePatcher;
//# sourceMappingURL=SparqlUpdatePatcher.js.map