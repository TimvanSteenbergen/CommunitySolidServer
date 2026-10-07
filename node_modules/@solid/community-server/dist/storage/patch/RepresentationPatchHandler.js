"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepresentationPatchHandler = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const ConflictHttpError_1 = require("../../util/errors/ConflictHttpError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const PatchHandler_1 = require("./PatchHandler");
/**
 * Handles a patch operation by getting the representation from the store, applying a `RepresentationPatcher`,
 * and then writing the result back to the store.
 *
 * In case there is no original representation (the store throws a `NotFoundHttpError`),
 * the patcher is expected to create a new one.
 */
class RepresentationPatchHandler extends PatchHandler_1.PatchHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    patcher;
    constructor(patcher) {
        super();
        this.patcher = patcher;
    }
    async handle({ source, patch, identifier }) {
        // Get the representation from the store
        let representation;
        try {
            // Internal types are converted unless specified otherwise like we do here
            // eslint-disable-next-line @typescript-eslint/naming-convention
            representation = await source.getRepresentation(identifier, { type: { '*/*': 1, [ContentTypes_1.INTERNAL_ALL]: 1 } });
        }
        catch (error) {
            // Solid, §5.1: "When a successful PUT or PATCH request creates a resource,
            // the server MUST use the effective request URI to assign the URI to that resource."
            // https://solid.github.io/specification/protocol#resource-type-heuristics
            if (!NotFoundHttpError_1.NotFoundHttpError.isInstance(error)) {
                throw error;
            }
            this.logger.debug(`Patching new resource ${identifier.path}`);
        }
        // Patch it
        const patched = await this.patcher.handleSafe({ patch, identifier, representation });
        // Solid, §5.3: "Servers MUST NOT allow HTTP PUT or PATCH on a container to update its containment triples;
        // if the server receives such a request, it MUST respond with a 409 status code."
        if ((0, PathUtil_1.isContainerIdentifier)(identifier)) {
            throw new ConflictHttpError_1.ConflictHttpError('Not allowed to execute PATCH requests on containers.');
        }
        // Write it back to the store
        return source.setRepresentation(identifier, patched);
    }
}
exports.RepresentationPatchHandler = RepresentationPatchHandler;
//# sourceMappingURL=RepresentationPatchHandler.js.map