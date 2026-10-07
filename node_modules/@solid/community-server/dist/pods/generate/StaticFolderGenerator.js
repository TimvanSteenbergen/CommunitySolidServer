"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticFolderGenerator = void 0;
/**
 * Stores a static template folder that will be used to call the wrapped {@link TemplatedResourcesGenerator}.
 */
class StaticFolderGenerator {
    resourcesGenerator;
    templateFolder;
    constructor(resourcesGenerator, templateFolder) {
        this.resourcesGenerator = resourcesGenerator;
        this.templateFolder = templateFolder;
    }
    generate(location, options) {
        return this.resourcesGenerator.generate(this.templateFolder, location, options);
    }
}
exports.StaticFolderGenerator = StaticFolderGenerator;
//# sourceMappingURL=StaticFolderGenerator.js.map