"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathBasedReader = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const IterableUtil_1 = require("../util/IterableUtil");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const MapUtil_1 = require("../util/map/MapUtil");
const PathUtil_1 = require("../util/PathUtil");
const PermissionReader_1 = require("./PermissionReader");
/**
 * Redirects requests to specific PermissionReaders based on their identifier.
 * The keys are regular expression strings.
 * The regular expressions should all start with a slash
 * and will be evaluated relative to the base URL.
 *
 * Will error if no match is found.
 */
class PathBasedReader extends PermissionReader_1.PermissionReader {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    baseUrl;
    paths;
    constructor(baseUrl, paths) {
        super();
        this.baseUrl = (0, PathUtil_1.ensureTrailingSlash)(baseUrl);
        const entries = Object.entries(paths)
            .map(([key, val]) => [new RegExp(key, 'u'), val]);
        this.paths = new Map(entries);
    }
    async handle(input) {
        const results = [];
        for (const [reader, readerModes] of this.matchReaders(input.requestedModes)) {
            results.push(await reader.handleSafe({ credentials: input.credentials, requestedModes: readerModes }));
        }
        return new IdentifierMap_1.IdentifierMap((0, IterableUtil_1.concat)(results));
    }
    /**
     *  Returns for each reader the matching part of the access map.
     */
    matchReaders(accessMap) {
        const result = new Map();
        for (const [identifier, modes] of accessMap) {
            const reader = this.findReader(identifier.path);
            if (reader) {
                const matches = (0, MapUtil_1.getDefault)(result, reader, () => new IdentifierMap_1.IdentifierSetMultiMap());
                matches.set(identifier, modes);
            }
        }
        return result;
    }
    /**
     * Find the PermissionReader corresponding to the given path.
     */
    findReader(path) {
        if (path.startsWith(this.baseUrl)) {
            // We want to keep the leading slash
            const relative = path.slice((0, PathUtil_1.trimTrailingSlashes)(this.baseUrl).length);
            for (const [regex, reader] of this.paths) {
                if (regex.test(relative)) {
                    this.logger.debug(`Permission reader found for ${path}`);
                    return reader;
                }
            }
        }
    }
}
exports.PathBasedReader = PathBasedReader;
//# sourceMappingURL=PathBasedReader.js.map