"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubdomainIdentifierGenerator = void 0;
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const StringUtil_1 = require("../../util/StringUtil");
/**
 * Generates identifiers by using the name as a subdomain on the base URL.
 * Non-alphanumeric characters will be replaced with `-`.
 *
 * When extracting the pod, the base URl is also seen as a pod as there is no issue of nested containers here.
 */
class SubdomainIdentifierGenerator {
    baseParts;
    constructor(baseUrl) {
        this.baseParts = (0, PathUtil_1.extractScheme)((0, PathUtil_1.ensureTrailingSlash)(baseUrl));
    }
    generate(name) {
        // Using the punycode converter is a risk as it doesn't convert slashes for example
        const cleanName = (0, StringUtil_1.sanitizeUrlPart)(name).toLowerCase();
        return { path: `${this.baseParts.scheme}${cleanName}.${this.baseParts.rest}` };
    }
    extractPod(identifier) {
        const { path } = identifier;
        // Invalid identifiers that have no result should never reach this point,
        // but some safety checks just in case.
        if (!path.startsWith(this.baseParts.scheme)) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid identifier ${path}`);
        }
        const idx = path.indexOf(this.baseParts.rest);
        // If the idx is smaller than this, there was no match
        if (idx < 0) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid identifier ${path}`);
        }
        // Slice of everything after the base URL tail
        return { path: path.slice(0, idx + this.baseParts.rest.length) };
    }
}
exports.SubdomainIdentifierGenerator = SubdomainIdentifierGenerator;
//# sourceMappingURL=SubdomainIdentifierGenerator.js.map