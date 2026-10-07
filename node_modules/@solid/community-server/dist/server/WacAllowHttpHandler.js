"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WacAllowHttpHandler = void 0;
const AclPermissionSet_1 = require("../authorization/permissions/AclPermissionSet");
const Permissions_1 = require("../authorization/permissions/Permissions");
const LogUtil_1 = require("../logging/LogUtil");
const NotModifiedHttpError_1 = require("../util/errors/NotModifiedHttpError");
const Vocabularies_1 = require("../util/Vocabularies");
const OperationHttpHandler_1 = require("./OperationHttpHandler");
const VALID_METHODS = new Set(['HEAD', 'GET']);
const VALID_ACL_MODES = new Set([Permissions_1.AccessMode.read, Permissions_1.AccessMode.write, Permissions_1.AccessMode.append, AclPermissionSet_1.AclMode.control]);
/**
 * Adds all the available permissions to the response metadata,
 * which can be used to generate the correct WAC-Allow header.
 *
 * This class does many things similar to the {@link AuthorizingHttpHandler},
 * so in general it is a good idea to make sure all these classes cache their results.
 */
class WacAllowHttpHandler extends OperationHttpHandler_1.OperationHttpHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    credentialsExtractor;
    modesExtractor;
    permissionReader;
    operationHandler;
    constructor(args) {
        super();
        this.credentialsExtractor = args.credentialsExtractor;
        this.modesExtractor = args.modesExtractor;
        this.permissionReader = args.permissionReader;
        this.operationHandler = args.operationHandler;
    }
    async handle(input) {
        const { request, operation } = input;
        let response;
        try {
            response = await this.operationHandler.handleSafe(input);
        }
        catch (error) {
            // WAC-Allow headers need to be added to 304 responses
            // as the value can differ even if the representation is the same.
            if (NotModifiedHttpError_1.NotModifiedHttpError.isInstance(error)) {
                response = error;
            }
            else {
                throw error;
            }
        }
        const { metadata } = response;
        // WAC-Allow is only needed for HEAD/GET requests
        if (!VALID_METHODS.has(operation.method) || !metadata) {
            return response;
        }
        this.logger.debug('Determining available permissions.');
        const credentials = await this.credentialsExtractor.handleSafe(request);
        const requestedModes = await this.modesExtractor.handleSafe(operation);
        const availablePermissions = await this.permissionReader.handleSafe({ credentials, requestedModes });
        const permissionSet = availablePermissions.get(operation.target);
        if (permissionSet) {
            const user = permissionSet;
            let everyone;
            if (credentials.agent?.webId) {
                // Need to determine public permissions
                this.logger.debug('Determining public permissions');
                // Note that this call can potentially create a new lock on a resource that is already locked,
                // so a locker that allows multiple read locks on the same resource is required.
                const permissionMap = await this.permissionReader.handleSafe({ credentials: {}, requestedModes });
                everyone = permissionMap.get(operation.target) ?? {};
            }
            else {
                // User is not authenticated so public permissions are the same as agent permissions
                this.logger.debug('User is not authenticated so has public permissions');
                everyone = user;
            }
            this.logger.debug('Adding WAC-Allow metadata');
            this.addWacAllowMetadata(metadata, everyone, user);
        }
        if (NotModifiedHttpError_1.NotModifiedHttpError.isInstance(response)) {
            throw response;
        }
        return response;
    }
    /**
     * Converts the found permissions to triples and puts them in the metadata.
     */
    addWacAllowMetadata(metadata, everyone, user) {
        const modes = new Set([...Object.keys(user), ...Object.keys(everyone)]);
        for (const mode of modes) {
            if (VALID_ACL_MODES.has(mode)) {
                const capitalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1);
                if (everyone[mode]) {
                    metadata.add(Vocabularies_1.AUTH.terms.publicMode, Vocabularies_1.ACL.terms[capitalizedMode]);
                }
                if (user[mode]) {
                    metadata.add(Vocabularies_1.AUTH.terms.userMode, Vocabularies_1.ACL.terms[capitalizedMode]);
                }
            }
        }
    }
}
exports.WacAllowHttpHandler = WacAllowHttpHandler;
//# sourceMappingURL=WacAllowHttpHandler.js.map