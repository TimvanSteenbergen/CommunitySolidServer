"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllStaticReader = void 0;
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const PermissionReader_1 = require("./PermissionReader");
/**
 * PermissionReader which sets all permissions to true or false
 * independently of the identifier and requested permissions.
 */
class AllStaticReader extends PermissionReader_1.PermissionReader {
    permissionSet;
    constructor(allow) {
        super();
        this.permissionSet = Object.freeze({
            read: allow,
            write: allow,
            append: allow,
            create: allow,
            delete: allow,
        });
    }
    async handle({ requestedModes }) {
        const availablePermissions = new IdentifierMap_1.IdentifierMap();
        for (const [identifier] of requestedModes) {
            availablePermissions.set(identifier, this.permissionSet);
        }
        return availablePermissions;
    }
}
exports.AllStaticReader = AllStaticReader;
//# sourceMappingURL=AllStaticReader.js.map