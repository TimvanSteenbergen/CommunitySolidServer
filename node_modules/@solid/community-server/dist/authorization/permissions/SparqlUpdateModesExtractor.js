"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparqlUpdateModesExtractor = void 0;
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const IdentifierMap_1 = require("../../util/map/IdentifierMap");
const ModesExtractor_1 = require("./ModesExtractor");
const Permissions_1 = require("./Permissions");
/**
 * Generates permissions for a SPARQL DELETE/INSERT body.
 * Updates with only an INSERT can be done with just append permissions,
 * while DELETEs require write permissions as well.
 */
class SparqlUpdateModesExtractor extends ModesExtractor_1.ModesExtractor {
    resourceSet;
    /**
     * Certain permissions depend on the existence of the target resource.
     * The provided {@link ResourceSet} will be used for that.
     *
     * @param resourceSet - {@link ResourceSet} that can verify the target resource existence.
     */
    constructor(resourceSet) {
        super();
        this.resourceSet = resourceSet;
    }
    async canHandle({ body }) {
        if (!this.isSparql(body)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Cannot determine permissions of non-SPARQL patches.');
        }
        if (!this.isSupported(body.algebra)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Can only determine permissions of a PATCH with DELETE/INSERT operations.');
        }
    }
    async handle({ body, target }) {
        // Verified in `canHandle` call
        const update = body.algebra;
        const requiredModes = new IdentifierMap_1.IdentifierSetMultiMap();
        if (this.isNop(update)) {
            return requiredModes;
        }
        // Access modes inspired by the requirements on N3 Patch requests
        if (this.hasConditions(update)) {
            requiredModes.add(target, Permissions_1.AccessMode.read);
        }
        if (this.hasInserts(update)) {
            requiredModes.add(target, Permissions_1.AccessMode.append);
            if (!await this.resourceSet.hasResource(target)) {
                requiredModes.add(target, Permissions_1.AccessMode.create);
            }
        }
        if (this.hasDeletes(update)) {
            requiredModes.add(target, Permissions_1.AccessMode.read);
            requiredModes.add(target, Permissions_1.AccessMode.write);
        }
        return requiredModes;
    }
    isSparql(data) {
        return Boolean(data.algebra);
    }
    isSupported(op) {
        if (this.isDeleteInsert(op) || this.isNop(op)) {
            return true;
        }
        if (op.type === sparqlalgebrajs_1.Algebra.types.COMPOSITE_UPDATE) {
            return op.updates.every((update) => this.isSupported(update));
        }
        return false;
    }
    isDeleteInsert(op) {
        return op.type === sparqlalgebrajs_1.Algebra.types.DELETE_INSERT;
    }
    isNop(op) {
        return op.type === sparqlalgebrajs_1.Algebra.types.NOP;
    }
    hasConditions(update) {
        if (this.isDeleteInsert(update)) {
            return Boolean(update.where && !this.isNop(update.where));
        }
        return update.updates.some((op) => this.hasConditions(op));
    }
    hasInserts(update) {
        if (this.isDeleteInsert(update)) {
            return Boolean(update.insert && update.insert.length > 0);
        }
        return update.updates.some((op) => this.hasInserts(op));
    }
    hasDeletes(update) {
        if (this.isDeleteInsert(update)) {
            return Boolean(update.delete && update.delete.length > 0);
        }
        return update.updates.some((op) => this.hasDeletes(op));
    }
}
exports.SparqlUpdateModesExtractor = SparqlUpdateModesExtractor;
//# sourceMappingURL=SparqlUpdateModesExtractor.js.map