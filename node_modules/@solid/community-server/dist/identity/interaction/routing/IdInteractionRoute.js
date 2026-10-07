"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdInteractionRoute = void 0;
const InternalServerError_1 = require("../../../util/errors/InternalServerError");
const PathUtil_1 = require("../../../util/PathUtil");
/**
 * An {@link InteractionRoute} for routes that have a dynamic identifier in their path.
 */
class IdInteractionRoute {
    base;
    idName;
    ensureSlash;
    matchRegex;
    constructor(base, idName, ensureSlash = true) {
        this.base = base;
        this.idName = idName;
        this.ensureSlash = ensureSlash;
        this.matchRegex = ensureSlash ? /(.*\/)([^/]+)\/$/u : /(.*\/)([^/]+)$/u;
    }
    getPath(parameters) {
        const id = parameters?.[this.idName];
        if (!id) {
            throw new InternalServerError_1.InternalServerError(`Missing ${this.idName} from getPath call. This implies a misconfigured path.`);
        }
        const path = this.base.getPath(parameters);
        return (0, PathUtil_1.joinUrl)(path, this.ensureSlash ? (0, PathUtil_1.ensureTrailingSlash)(id) : id);
    }
    matchPath(path) {
        const match = this.matchRegex.exec(path);
        if (!match) {
            return;
        }
        const id = match[2];
        const head = match[1];
        const baseParameters = this.base.matchPath(head);
        if (!baseParameters) {
            return;
        }
        // Cast needed because TS always assumes type is { [x: string]: string; } when using [] like this
        // https://github.com/microsoft/TypeScript/issues/13948
        return { ...baseParameters, [this.idName]: id };
    }
}
exports.IdInteractionRoute = IdInteractionRoute;
//# sourceMappingURL=IdInteractionRoute.js.map