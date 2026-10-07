"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionPermissionReader = void 0;
const UnionHandler_1 = require("../util/handlers/UnionHandler");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const MapUtil_1 = require("../util/map/MapUtil");
/**
 * Combines the results of multiple PermissionReaders.
 * Every permission in every credential type is handled according to the rule `false` \> `true` \> `undefined`.
 */
class UnionPermissionReader extends UnionHandler_1.UnionHandler {
    constructor(readers) {
        super(readers);
    }
    async combine(results) {
        const result = new IdentifierMap_1.IdentifierMap();
        for (const permissionMap of results) {
            this.mergePermissionMaps(permissionMap, result);
        }
        return result;
    }
    /**
     * Merges all entries of the given map into the result map.
     */
    mergePermissionMaps(permissionMap, result) {
        for (const [identifier, permissionSet] of permissionMap) {
            const resultSet = (0, MapUtil_1.getDefault)(result, identifier, () => ({}));
            result.set(identifier, this.mergePermissions(permissionSet, resultSet));
        }
    }
    /**
     * Adds the given permissions to the result object according to the combination rules of the class.
     */
    mergePermissions(permissions, result) {
        for (const [key, value] of Object.entries(permissions)) {
            if (typeof value !== 'undefined' && result[key] !== false) {
                result[key] = value;
            }
        }
        return result;
    }
}
exports.UnionPermissionReader = UnionPermissionReader;
//# sourceMappingURL=UnionPermissionReader.js.map