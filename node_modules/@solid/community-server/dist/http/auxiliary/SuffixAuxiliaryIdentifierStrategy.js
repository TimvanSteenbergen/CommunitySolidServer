"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuffixAuxiliaryIdentifierStrategy = void 0;
const InternalServerError_1 = require("../../util/errors/InternalServerError");
/**
 * Helper class that uses a suffix to determine if a resource is an auxiliary resource or not.
 * Simple string matching is used, so the dot needs to be included if needed, e.g. ".acl".
 */
class SuffixAuxiliaryIdentifierStrategy {
    suffix;
    constructor(suffix) {
        if (suffix.length === 0) {
            throw new InternalServerError_1.InternalServerError('Suffix length should be non-zero.');
        }
        this.suffix = suffix;
    }
    getAuxiliaryIdentifier(identifier) {
        return { path: `${identifier.path}${this.suffix}` };
    }
    getAuxiliaryIdentifiers(identifier) {
        return [this.getAuxiliaryIdentifier(identifier)];
    }
    isAuxiliaryIdentifier(identifier) {
        return identifier.path.endsWith(this.suffix);
    }
    getSubjectIdentifier(identifier) {
        if (!this.isAuxiliaryIdentifier(identifier)) {
            throw new InternalServerError_1.InternalServerError(`${identifier.path} does not end on ${this.suffix} so no conversion is possible.`);
        }
        return { path: identifier.path.slice(0, -this.suffix.length) };
    }
}
exports.SuffixAuxiliaryIdentifierStrategy = SuffixAuxiliaryIdentifierStrategy;
//# sourceMappingURL=SuffixAuxiliaryIdentifierStrategy.js.map