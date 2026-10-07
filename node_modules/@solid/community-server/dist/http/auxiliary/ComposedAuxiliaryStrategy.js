"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedAuxiliaryStrategy = void 0;
/**
 * An {@link AuxiliaryStrategy} that provides its functionality through the combination of
 * an {@link AuxiliaryIdentifierStrategy}, {@link MetadataGenerator} and {@link Validator}.
 */
class ComposedAuxiliaryStrategy {
    identifierStrategy;
    metadataGenerator;
    validator;
    ownAuthorization;
    requiredInRoot;
    constructor(identifierStrategy, metadataGenerator, validator, ownAuthorization = false, requiredInRoot = false) {
        this.identifierStrategy = identifierStrategy;
        this.metadataGenerator = metadataGenerator;
        this.validator = validator;
        this.ownAuthorization = ownAuthorization;
        this.requiredInRoot = requiredInRoot;
    }
    getAuxiliaryIdentifier(identifier) {
        return this.identifierStrategy.getAuxiliaryIdentifier(identifier);
    }
    getAuxiliaryIdentifiers(identifier) {
        return this.identifierStrategy.getAuxiliaryIdentifiers(identifier);
    }
    isAuxiliaryIdentifier(identifier) {
        return this.identifierStrategy.isAuxiliaryIdentifier(identifier);
    }
    getSubjectIdentifier(identifier) {
        return this.identifierStrategy.getSubjectIdentifier(identifier);
    }
    usesOwnAuthorization() {
        return this.ownAuthorization;
    }
    isRequiredInRoot() {
        return this.requiredInRoot;
    }
    async addMetadata(metadata) {
        if (this.metadataGenerator) {
            return this.metadataGenerator.handleSafe(metadata);
        }
    }
    async validate(representation) {
        if (this.validator) {
            await this.validator.handleSafe({
                representation,
                identifier: { path: representation.metadata.identifier.value },
            });
        }
    }
}
exports.ComposedAuxiliaryStrategy = ComposedAuxiliaryStrategy;
//# sourceMappingURL=ComposedAuxiliaryStrategy.js.map