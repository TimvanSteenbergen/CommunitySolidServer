"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelativePathInteractionRoute = void 0;
const InternalServerError_1 = require("../../../util/errors/InternalServerError");
const PathUtil_1 = require("../../../util/PathUtil");
/**
 * A route that is relative to another route.
 * The relative path will be joined to the input base,
 * which can either be an absolute URL or an InteractionRoute of which the path will be used.
 */
class RelativePathInteractionRoute {
    base;
    relativePath;
    constructor(base, relativePath, ensureSlash = true) {
        this.base = base;
        this.relativePath = (0, PathUtil_1.trimLeadingSlashes)(relativePath);
        if (ensureSlash) {
            this.relativePath = (0, PathUtil_1.ensureTrailingSlash)(this.relativePath);
        }
    }
    getPath(parameters) {
        const path = this.base.getPath(parameters);
        if (!path.endsWith('/')) {
            throw new InternalServerError_1.InternalServerError(`Expected ${path} to end on a slash so it could be extended. This indicates a configuration error.`);
        }
        return (0, PathUtil_1.joinUrl)(path, this.relativePath);
    }
    matchPath(path) {
        if (!path.endsWith(this.relativePath)) {
            return;
        }
        const head = path.slice(0, -this.relativePath.length);
        return this.base.matchPath(head);
    }
}
exports.RelativePathInteractionRoute = RelativePathInteractionRoute;
//# sourceMappingURL=RelativePathInteractionRoute.js.map