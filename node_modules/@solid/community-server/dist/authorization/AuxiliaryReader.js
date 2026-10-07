"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuxiliaryReader = void 0;
const LogUtil_1 = require("../logging/LogUtil");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const MapUtil_1 = require("../util/map/MapUtil");
const PermissionReader_1 = require("./PermissionReader");
/**
 * Determines the permissions of auxiliary resources by finding those of the corresponding subject resources.
 */
class AuxiliaryReader extends PermissionReader_1.PermissionReader {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    reader;
    auxiliaryStrategy;
    constructor(reader, auxiliaryStrategy) {
        super();
        this.reader = reader;
        this.auxiliaryStrategy = auxiliaryStrategy;
    }
    async handle({ requestedModes, credentials }) {
        // Finds all the dependent auxiliary identifiers
        const auxiliaries = this.findAuxiliaries(requestedModes);
        // Replaces the dependent auxiliary identifies with the corresponding subject identifiers
        const updatedMap = (0, MapUtil_1.modify)(new IdentifierMap_1.IdentifierSetMultiMap(requestedModes), { add: auxiliaries.values(), remove: auxiliaries.keys() });
        const result = await this.reader.handleSafe({ requestedModes: updatedMap, credentials });
        // Extracts the auxiliary permissions based on the subject permissions
        for (const [identifier, [subject]] of auxiliaries) {
            this.logger.debug(`Mapping ${subject.path} permissions to ${identifier.path}`);
            result.set(identifier, result.get(subject) ?? {});
        }
        return result;
    }
    /**
     * Maps auxiliary resources that do not have their own authorization checks to their subject resource.
     */
    findAuxiliaries(requestedModes) {
        const auxiliaries = new IdentifierMap_1.IdentifierMap();
        for (const [identifier, modes] of requestedModes.entrySets()) {
            if (this.isDependentAuxiliary(identifier)) {
                auxiliaries.set(identifier, [this.auxiliaryStrategy.getSubjectIdentifier(identifier), modes]);
            }
        }
        return auxiliaries;
    }
    /**
     * Checks if the identifier is an auxiliary resource that uses subject permissions.
     */
    isDependentAuxiliary(identifier) {
        return this.auxiliaryStrategy.isAuxiliaryIdentifier(identifier) &&
            !this.auxiliaryStrategy.usesOwnAuthorization(identifier);
    }
}
exports.AuxiliaryReader = AuxiliaryReader;
//# sourceMappingURL=AuxiliaryReader.js.map