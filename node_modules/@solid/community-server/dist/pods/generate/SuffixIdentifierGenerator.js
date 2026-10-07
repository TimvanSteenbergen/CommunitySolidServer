"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuffixIdentifierGenerator = void 0;
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const StringUtil_1 = require("../../util/StringUtil");
/**
 * Generates identifiers by appending the name to a stored base identifier.
 * Non-alphanumeric characters will be replaced with `-`.
 */
class SuffixIdentifierGenerator {
    base;
    constructor(base) {
        this.base = base;
    }
    generate(name) {
        const cleanName = (0, StringUtil_1.sanitizeUrlPart)(name).toLowerCase();
        return { path: (0, PathUtil_1.ensureTrailingSlash)(new URL(cleanName, this.base).href) };
    }
    extractPod(identifier) {
        const { path } = identifier;
        // Invalid identifiers that have no result should never reach this point,
        // but some safety checks just in case.
        if (!path.startsWith(this.base)) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid identifier ${path}`);
        }
        // The first slash after the base URL indicates the first container on the path
        const idx = path.indexOf('/', this.base.length + 1);
        if (idx < 0) {
            throw new BadRequestHttpError_1.BadRequestHttpError(`Invalid identifier ${path}`);
        }
        // Slice of everything after the first container
        return { path: path.slice(0, idx + 1) };
    }
}
exports.SuffixIdentifierGenerator = SuffixIdentifierGenerator;
//# sourceMappingURL=SuffixIdentifierGenerator.js.map