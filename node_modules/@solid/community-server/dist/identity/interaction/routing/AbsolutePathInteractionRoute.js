"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsolutePathInteractionRoute = void 0;
const PathUtil_1 = require("../../../util/PathUtil");
/**
 * A route that stores a single absolute path.
 */
class AbsolutePathInteractionRoute {
    path;
    constructor(path, ensureSlash = true) {
        this.path = path;
        if (ensureSlash) {
            this.path = (0, PathUtil_1.ensureTrailingSlash)(this.path);
        }
    }
    getPath() {
        return this.path;
    }
    matchPath(path) {
        if (path === this.path) {
            return {};
        }
    }
}
exports.AbsolutePathInteractionRoute = AbsolutePathInteractionRoute;
//# sourceMappingURL=AbsolutePathInteractionRoute.js.map