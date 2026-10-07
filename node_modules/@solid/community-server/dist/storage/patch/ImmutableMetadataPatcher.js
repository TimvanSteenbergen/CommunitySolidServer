"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImmutableMetadataPatcher = void 0;
const n3_1 = require("n3");
const LogUtil_1 = require("../../logging/LogUtil");
const ConflictHttpError_1 = require("../../util/errors/ConflictHttpError");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const RepresentationPatcher_1 = require("./RepresentationPatcher");
var namedNode = n3_1.DataFactory.namedNode;
/**
 * Guarantees that certain PATCH operations MUST NOT update certain triples in metadata resources.
 * Furthermore, this class also handles the patching for metadata resources.
 * List of triples that must not be updated are given during instantiation with the ImmutableTriple class.
 * When there is a change to an Immutable Triple, then a ConflictError will be thrown.
 */
class ImmutableMetadataPatcher extends RepresentationPatcher_1.RepresentationPatcher {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    patcher;
    metadataStrategy;
    immutablePatterns;
    constructor(patcher, metadataStrategy, immutablePatterns) {
        super();
        this.patcher = patcher;
        this.metadataStrategy = metadataStrategy;
        this.immutablePatterns = immutablePatterns;
    }
    async canHandle(input) {
        if (!this.metadataStrategy.isAuxiliaryIdentifier(input.identifier)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('This handler only supports metadata resources.');
        }
        await this.patcher.canHandle(input);
    }
    async handle(input) {
        if (!input.representation) {
            throw new InternalServerError_1.InternalServerError('Patcher requires a representation as input.');
        }
        const store = input.representation.dataset;
        const immutablePatternMap = new Map();
        const baseSubject = namedNode(this.metadataStrategy.getSubjectIdentifier(input.identifier).path);
        for (const immutablePattern of this.immutablePatterns) {
            const { predicate, object } = immutablePattern;
            const subject = immutablePattern.subject ?? baseSubject;
            const matches = store.getQuads(subject, predicate, object, null);
            immutablePatternMap.set({ subject, predicate, object }, matches);
        }
        const patchedRepresentation = await this.patcher.handle(input);
        for (const [filterPattern, originalQuads] of immutablePatternMap.entries()) {
            const { subject, predicate, object } = filterPattern;
            const quads = patchedRepresentation.dataset.getQuads(subject, predicate, object, null);
            const predicateString = predicate ? `<${predicate.value}>` : '?p';
            const objectString = object ? `<${object.value}>` : '?o';
            if (quads.length !== originalQuads.length) {
                throw new ConflictHttpError_1.ConflictHttpError(`Not allowed to edit metadata of the form "<${subject.value}> ${predicateString} ${objectString}.".`);
            }
            const changed = quads.some((inputQuad) => !originalQuads
                .some((patchedQuad) => inputQuad.equals(patchedQuad)));
            if (changed) {
                throw new ConflictHttpError_1.ConflictHttpError(`Not allowed to edit metadata of the form "<${subject.value}> ${predicateString} ${objectString}.".`);
            }
        }
        return input.representation;
    }
}
exports.ImmutableMetadataPatcher = ImmutableMetadataPatcher;
//# sourceMappingURL=ImmutableMetadataPatcher.js.map