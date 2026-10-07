"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingAuxiliaryStrategy = void 0;
const RoutingAuxiliaryIdentifierStrategy_1 = require("./RoutingAuxiliaryIdentifierStrategy");
/**
 * An {@link AuxiliaryStrategy} that combines multiple AuxiliaryStrategies into one.
 * Uses `isAuxiliaryIdentifier` to know which strategy to call for which call.
 *
 * `addMetadata` will either call all strategies if the input is the subject identifier,
 * or only the matching strategy if the input is an auxiliary identifier.
 */
class RoutingAuxiliaryStrategy extends RoutingAuxiliaryIdentifierStrategy_1.RoutingAuxiliaryIdentifierStrategy {
    sources = [];
    constructor(sources) {
        super(sources);
        this.sources = sources;
    }
    usesOwnAuthorization(identifier) {
        const source = this.getMatchingSource(identifier);
        return source.usesOwnAuthorization(identifier);
    }
    isRequiredInRoot(identifier) {
        const source = this.getMatchingSource(identifier);
        return source.isRequiredInRoot(identifier);
    }
    async addMetadata(metadata) {
        const identifier = { path: metadata.identifier.value };
        // Make sure unrelated auxiliary strategies don't add metadata to another auxiliary resource
        const match = this.sources.find((source) => source.isAuxiliaryIdentifier(identifier));
        if (match) {
            await match.addMetadata(metadata);
        }
        else {
            for (const source of this.sources) {
                await source.addMetadata(metadata);
            }
        }
    }
    async validate(representation) {
        const identifier = { path: representation.metadata.identifier.value };
        const source = this.getMatchingSource(identifier);
        return source.validate(representation);
    }
    // Updated with new source typings
    getMatchingSource(identifier) {
        return super.getMatchingSource(identifier);
    }
}
exports.RoutingAuxiliaryStrategy = RoutingAuxiliaryStrategy;
//# sourceMappingURL=RoutingAuxiliaryStrategy.js.map