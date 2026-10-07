"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRepresentationStore = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const NotFoundHttpError_1 = require("../util/errors/NotFoundHttpError");
const PathUtil_1 = require("../util/PathUtil");
const StringUtil_1 = require("../util/StringUtil");
const ConversionUtil_1 = require("./conversion/ConversionUtil");
const PassthroughStore_1 = require("./PassthroughStore");
/**
 * Allow containers to have a custom representation.
 * The index representation will be returned when the following conditions are fulfilled:
 *  * The request targets a container.
 *  * A resource with the given `indexName` exists in the container. (default: "index.html")
 *  * The highest weighted preference matches the `mediaRange` (default: "text/html")
 * Otherwise the request will be passed on to the source store.
 * In case the index representation should always be returned when it exists,
 * the `mediaRange` should be set to "\*∕\*".
 *
 * Note: this functionality is not yet part of the specification. Relevant issues are:
 * - https://github.com/solid/specification/issues/69
 * - https://github.com/solid/specification/issues/198
 * - https://github.com/solid/specification/issues/109
 * - https://github.com/solid/web-access-control-spec/issues/36
 */
class IndexRepresentationStore extends PassthroughStore_1.PassthroughStore {
    indexName;
    mediaRange;
    constructor(source, indexName = 'index.html', mediaRange = 'text/html') {
        super(source);
        (0, node_assert_1.default)((0, StringUtil_1.isValidFileName)(indexName), 'Invalid index name');
        this.indexName = indexName;
        this.mediaRange = mediaRange;
    }
    async getRepresentation(identifier, preferences, conditions) {
        if ((0, PathUtil_1.isContainerIdentifier)(identifier) && this.matchesPreferences(preferences)) {
            try {
                const indexIdentifier = { path: `${identifier.path}${this.indexName}` };
                const index = await this.source.getRepresentation(indexIdentifier, preferences, conditions);
                // We only care about the container metadata so preferences don't matter
                const container = await this.source.getRepresentation(identifier, {}, conditions);
                container.data.destroy();
                // Uses the container metadata but with the index content-type.
                // There is potential metadata loss if there is more representation-specific metadata,
                // but that can be looked into once the issues above are resolved.
                const { contentType } = index.metadata;
                index.metadata = container.metadata;
                index.metadata.contentType = contentType;
                return index;
            }
            catch (error) {
                if (!NotFoundHttpError_1.NotFoundHttpError.isInstance(error)) {
                    throw error;
                }
            }
        }
        return this.source.getRepresentation(identifier, preferences, conditions);
    }
    /**
     * Makes sure the stored media range explicitly matches the highest weight preference.
     */
    matchesPreferences(preferences) {
        // Always match */*
        if (this.mediaRange === '*/*') {
            return true;
        }
        // Otherwise, determine if an explicit match has the highest weight
        const types = (0, ConversionUtil_1.cleanPreferences)(preferences.type);
        const max = Math.max(...Object.values(types));
        return Object.entries(types).some(([range, weight]) => range !== '*/*' && (max - weight) < 0.01 && (0, ConversionUtil_1.matchesMediaType)(range, this.mediaRange));
    }
}
exports.IndexRepresentationStore = IndexRepresentationStore;
//# sourceMappingURL=IndexRepresentationStore.js.map