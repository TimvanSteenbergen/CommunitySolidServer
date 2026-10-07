"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonResourceStorage = void 0;
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const LogUtil_1 = require("../../logging/LogUtil");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
/**
 * A {@link KeyValueStorage} for JSON-like objects using a {@link ResourceStore} as backend.
 *
 * Creates a base URL by joining the input base URL with the container string.
 * The storage assumes it has ownership over all entries in the target container
 * so no other classes should access resources there to prevent issues.
 *
 * Assumes the input keys can be safely used to generate identifiers,
 * which will be appended to the stored base URL.
 *
 * All non-404 errors will be re-thrown.
 */
class JsonResourceStorage {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    source;
    container;
    constructor(source, baseUrl, container) {
        this.source = source;
        this.container = (0, PathUtil_1.ensureTrailingSlash)((0, PathUtil_1.joinUrl)(baseUrl, container));
    }
    async get(key) {
        try {
            const identifier = this.keyToIdentifier(key);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const representation = await this.source.getRepresentation(identifier, { type: { 'application/json': 1 } });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return JSON.parse(await (0, StreamUtil_1.readableToString)(representation.data));
        }
        catch (error) {
            if (!NotFoundHttpError_1.NotFoundHttpError.isInstance(error)) {
                throw error;
            }
        }
    }
    async has(key) {
        const identifier = this.keyToIdentifier(key);
        return this.source.hasResource(identifier);
    }
    async set(key, value) {
        const identifier = this.keyToIdentifier(key);
        const representation = new BasicRepresentation_1.BasicRepresentation(JSON.stringify(value), identifier, 'application/json');
        await this.source.setRepresentation(identifier, representation);
        return this;
    }
    async delete(key) {
        try {
            const identifier = this.keyToIdentifier(key);
            await this.source.deleteResource(identifier);
            return true;
        }
        catch (error) {
            if (!NotFoundHttpError_1.NotFoundHttpError.isInstance(error)) {
                throw error;
            }
            return false;
        }
    }
    async *entries() {
        yield* this.getResourceEntries({ path: this.container });
    }
    /**
     * Recursively iterates through the container to find all documents.
     */
    async *getResourceEntries(identifier) {
        const representation = await this.safelyGetResource(identifier);
        if (representation) {
            if ((0, PathUtil_1.isContainerIdentifier)(identifier)) {
                // Only need the metadata
                representation.data.destroy();
                const members = representation.metadata.getAll(Vocabularies_1.LDP.terms.contains).map((term) => term.value);
                for (const path of members) {
                    yield* this.getResourceEntries({ path });
                }
            }
            else {
                try {
                    const json = JSON.parse(await (0, StreamUtil_1.readableToString)(representation.data));
                    yield [this.identifierToKey(identifier), json];
                }
                catch (error) {
                    this.logger.error(`Unable to parse ${identifier.path}. You should probably delete this resource manually. Error: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
                }
            }
        }
    }
    /**
     * Returns the representation for the given identifier.
     * Returns undefined if a 404 error is thrown.
     * Re-throws the error in all other cases.
     */
    async safelyGetResource(identifier) {
        let representation;
        try {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const preferences = (0, PathUtil_1.isContainerIdentifier)(identifier) ? {} : { type: { 'application/json': 1 } };
            representation = await this.source.getRepresentation(identifier, preferences);
        }
        catch (error) {
            // Can happen if resource is deleted by this point.
            // When using this for internal data this can specifically happen quite often with locks.
            if (!NotFoundHttpError_1.NotFoundHttpError.isInstance(error)) {
                throw error;
            }
        }
        return representation;
    }
    /**
     * Converts a key into an identifier for internal storage.
     */
    keyToIdentifier(key) {
        return { path: (0, PathUtil_1.joinUrl)(this.container, key) };
    }
    /**
     * Converts an internal identifier to an external key.
     */
    identifierToKey(identifier) {
        // Due to the usage of `joinUrl` we don't know for sure if there was a preceding slash,
        // so we always remove leading slashes one for consistency.
        // In practice this only has an impact on the `entries` call
        // and only if class calling this depends on a leading slash still being there.
        return (0, PathUtil_1.trimLeadingSlashes)(identifier.path.slice(this.container.length));
    }
}
exports.JsonResourceStorage = JsonResourceStorage;
//# sourceMappingURL=JsonResourceStorage.js.map