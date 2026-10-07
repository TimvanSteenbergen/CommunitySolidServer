"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAuxiliaryReader = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const MapUtil_1 = require("../util/map/MapUtil");
const PermissionReader_1 = require("./PermissionReader");
const AclPermissionSet_1 = require("./permissions/AclPermissionSet");
/**
 * Determines the permission for authorization resources (such as ACL or ACR).
 * In contrast to the regular resource mechanism, read/write access to authorization resources
 * is obtained by setting Control permissions on the corresponding subject resource
 * rather than directly setting permissions for the authorization resource itself.
 * Hence, this class transforms Control permissions on the subject resource
 * to Read/Write permissions on the authorization resource.
 */
class AuthAuxiliaryReader extends PermissionReader_1.PermissionReader {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    reader;
    authStrategy;
    constructor(reader, authStrategy) {
        super();
        this.reader = reader;
        this.authStrategy = authStrategy;
    }
    async handle({ requestedModes, credentials }) {
        // Finds all the ACL identifiers
        const authMap = new Map(this.findAuth(requestedModes));
        // Replaces the ACL identifies with the corresponding subject identifiers
        const updatedMap = (0, MapUtil_1.modify)(new IdentifierMap_1.IdentifierSetMultiMap(requestedModes), { add: authMap.values(), remove: authMap.keys() });
        const result = await this.reader.handleSafe({ requestedModes: updatedMap, credentials });
        // Extracts the permissions based on the subject control permissions
        for (const [identifier, [subject]] of authMap) {
            this.logger.debug(`Mapping ${subject.path} control permission to all permissions for ${identifier.path}`);
            result.set(identifier, this.interpretControl(identifier, result.get(subject)));
        }
        return result;
    }
    /**
     * Finds all authorization resource identifiers and maps them to their subject identifier and the requested modes.
     */
    *findAuth(accessMap) {
        for (const [identifier] of accessMap) {
            if (this.authStrategy.isAuxiliaryIdentifier(identifier)) {
                const subject = this.authStrategy.getSubjectIdentifier(identifier);
                // Unfortunately there is no enum inheritance so we have to cast like this
                yield [identifier, [subject, new Set([AclPermissionSet_1.AclMode.control])]];
            }
        }
    }
    /**
     * Updates the permissions for an authorization resource
     * by interpreting the Control access mode as allowing full access.
     */
    interpretControl(identifier, permissionSet = {}) {
        const { control } = permissionSet;
        return {
            read: control,
            append: control,
            write: control,
            control,
        };
    }
}
exports.AuthAuxiliaryReader = AuthAuxiliaryReader;
//# sourceMappingURL=AuthAuxiliaryReader.js.map