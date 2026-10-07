"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetPathExtractor = void 0;
const PathUtil_1 = require("../../../util/PathUtil");
const ShorthandExtractor_1 = require("./ShorthandExtractor");
/**
 * A {@link ShorthandExtractor} that converts a path value to an absolute asset path
 * by making use of `resolveAssetPath`.
 * Returns the default path in case it is defined and no path was found in the map.
 */
class AssetPathExtractor extends ShorthandExtractor_1.ShorthandExtractor {
    key;
    defaultPath;
    constructor(key, defaultPath) {
        super();
        this.key = key;
        this.defaultPath = defaultPath;
    }
    async handle(args) {
        const path = args[this.key] ?? this.defaultPath;
        if (path) {
            if (typeof path !== 'string') {
                throw new TypeError(`Invalid ${this.key} argument`);
            }
            return (0, PathUtil_1.resolveAssetPath)(path);
        }
        return null;
    }
}
exports.AssetPathExtractor = AssetPathExtractor;
//# sourceMappingURL=AssetPathExtractor.js.map