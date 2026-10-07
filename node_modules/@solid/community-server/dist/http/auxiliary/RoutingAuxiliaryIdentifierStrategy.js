"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingAuxiliaryIdentifierStrategy = void 0;
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
/**
 * An {@link AuxiliaryIdentifierStrategy} that combines multiple AuxiliaryIdentifierStrategies into one.
 * Uses `isAuxiliaryIdentifier` to know which strategy to route to.
 */
class RoutingAuxiliaryIdentifierStrategy {
    sources;
    constructor(sources) {
        this.sources = sources;
    }
    getAuxiliaryIdentifier() {
        throw new InternalServerError_1.InternalServerError('RoutingAuxiliaryIdentifierStrategy has multiple auxiliary strategies and thus no single auxiliary identifier.');
    }
    getAuxiliaryIdentifiers(identifier) {
        return this.sources.flatMap((source) => source.getAuxiliaryIdentifiers(identifier));
    }
    isAuxiliaryIdentifier(identifier) {
        return this.sources.some((source) => source.isAuxiliaryIdentifier(identifier));
    }
    getSubjectIdentifier(identifier) {
        const source = this.getMatchingSource(identifier);
        return source.getSubjectIdentifier(identifier);
    }
    getMatchingSource(identifier) {
        const match = this.sources.find((source) => source.isAuxiliaryIdentifier(identifier));
        if (!match) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Could not find an AuxiliaryManager for ${identifier.path}`);
        }
        return match;
    }
}
exports.RoutingAuxiliaryIdentifierStrategy = RoutingAuxiliaryIdentifierStrategy;
//# sourceMappingURL=RoutingAuxiliaryIdentifierStrategy.js.map