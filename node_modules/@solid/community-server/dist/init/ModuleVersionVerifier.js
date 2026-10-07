"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleVersionVerifier = void 0;
const PathUtil_1 = require("../util/PathUtil");
const Initializer_1 = require("./Initializer");
/**
 * This initializer simply writes the version number of the server to the storage.
 * This will be relevant in the future when we look into migration initializers.
 *
 * It automatically parses the version number from the `package.json`.
 */
class ModuleVersionVerifier extends Initializer_1.Initializer {
    storageKey;
    storage;
    constructor(storageKey, storage) {
        super();
        this.storageKey = storageKey;
        this.storage = storage;
    }
    async handle() {
        const pkg = await (0, PathUtil_1.readPackageJson)();
        await this.storage.set(this.storageKey, pkg.version);
    }
}
exports.ModuleVersionVerifier = ModuleVersionVerifier;
//# sourceMappingURL=ModuleVersionVerifier.js.map