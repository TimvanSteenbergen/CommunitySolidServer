"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubfolderResourcesGenerator = void 0;
const IterableUtil_1 = require("../../util/IterableUtil");
const PathUtil_1 = require("../../util/PathUtil");
// Sorts Resources based on their identifiers
function comparator(left, right) {
    return left.identifier.path.localeCompare(right.identifier.path);
}
/**
 * Generates all resources found in specific subfolders of the given template folder.
 * In case the same resource is defined in several subfolders,
 * the data of the last subfolder in the list will be used.
 *
 * The results of all the subfolders will be merged so the end result is still a sorted stream of identifiers.
 *
 * One of the main use cases for this class is so template resources can be in a separate folder
 * than their corresponding authorization resources,
 * allowing for authorization-independent templates.
 */
class SubfolderResourcesGenerator {
    resourcesGenerator;
    subfolders;
    constructor(resourcesGenerator, subfolders) {
        this.resourcesGenerator = resourcesGenerator;
        this.subfolders = subfolders;
    }
    async *generate(templateFolder, location, options) {
        const root = (0, PathUtil_1.resolveAssetPath)(templateFolder);
        const templateSubfolders = this.subfolders.map((subfolder) => (0, PathUtil_1.joinFilePath)(root, subfolder));
        // Build all generators
        const generators = [];
        for (const templateSubfolder of templateSubfolders) {
            generators.push(this.resourcesGenerator.generate(templateSubfolder, location, options)[Symbol.asyncIterator]());
        }
        let previous = { path: '' };
        for await (const result of (0, IterableUtil_1.sortedAsyncMerge)(generators, comparator)) {
            // Skip duplicate results.
            // In practice these are just going to be the same empty containers.
            if (result.identifier.path === previous.path) {
                result.representation.data.destroy();
            }
            else {
                previous = result.identifier;
                yield result;
            }
        }
    }
}
exports.SubfolderResourcesGenerator = SubfolderResourcesGenerator;
//# sourceMappingURL=SubfolderResourcesGenerator.js.map