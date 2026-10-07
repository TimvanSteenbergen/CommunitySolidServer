"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleContainerJsonStorage = void 0;
const JsonResourceStorage_1 = require("../../storage/keyvalue/JsonResourceStorage");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const PathUtil_1 = require("../../util/PathUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
/**
 * A variant of a {@link JsonResourceStorage} where the `entries()` call
 * does not recursively iterate through all containers.
 * Only the documents that are found in the root container are returned.
 *
 * This class was created to support migration where different storages are nested in one main `.internal` container,
 * and we specifically want to only return entries of one storage.
 */
class SingleContainerJsonStorage extends JsonResourceStorage_1.JsonResourceStorage {
    async *getResourceEntries(containerId) {
        const container = await this.safelyGetResource(containerId);
        if (!container) {
            return;
        }
        // Only need the metadata
        container.data.destroy();
        const members = container.metadata.getAll(Vocabularies_1.LDP.terms.contains).map((term) => term.value);
        for (const path of members) {
            const documentId = { path };
            if ((0, PathUtil_1.isContainerIdentifier)(documentId)) {
                continue;
            }
            const document = await this.safelyGetResource(documentId);
            if (!document) {
                continue;
            }
            const key = this.identifierToKey(documentId);
            try {
                const json = JSON.parse(await (0, StreamUtil_1.readableToString)(document.data));
                yield [key, json];
            }
            catch (error) {
                this.logger.error(`Unable to parse ${path}. You should probably delete this resource manually. Error: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            }
        }
    }
}
exports.SingleContainerJsonStorage = SingleContainerJsonStorage;
//# sourceMappingURL=SingleContainerJsonStorage.js.map