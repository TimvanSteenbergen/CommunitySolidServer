"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticStorageDescriber = void 0;
const n3_1 = require("n3");
const rdf_string_1 = require("rdf-string");
const StorageDescriber_1 = require("./StorageDescriber");
var quad = n3_1.DataFactory.quad;
var namedNode = n3_1.DataFactory.namedNode;
/**
 * Adds a fixed set of triples to the storage description resource,
 * with the resource identifier as subject.
 *
 * This can be used to add descriptions that a storage always needs to have,
 * such as the `<> a pim:Storage` triple.
 */
class StaticStorageDescriber extends StorageDescriber_1.StorageDescriber {
    terms;
    constructor(terms) {
        super();
        const termMap = new Map();
        for (const [predicate, objects] of Object.entries(terms)) {
            const predTerm = (0, rdf_string_1.stringToTerm)(predicate);
            if (predTerm.termType !== 'NamedNode') {
                throw new Error('Predicate needs to be a named node.');
            }
            const objTerms = (Array.isArray(objects) ? objects : [objects]).map((obj) => (0, rdf_string_1.stringToTerm)(obj));
            // `stringToTerm` can only generate valid term types
            termMap.set(predTerm, objTerms);
        }
        this.terms = termMap;
    }
    async handle(target) {
        const subject = namedNode(target.path);
        return [...this.generateTriples(subject)];
    }
    *generateTriples(subject) {
        for (const [predicate, objects] of this.terms.entries()) {
            for (const object of objects) {
                yield quad(subject, predicate, object);
            }
        }
    }
}
exports.StaticStorageDescriber = StaticStorageDescriber;
//# sourceMappingURL=StaticStorageDescriber.js.map