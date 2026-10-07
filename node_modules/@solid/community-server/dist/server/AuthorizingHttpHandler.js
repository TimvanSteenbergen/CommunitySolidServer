"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizingHttpHandler = void 0;
const n3_1 = require("n3");
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const HttpError_1 = require("../util/errors/HttpError");
const Vocabularies_1 = require("../util/Vocabularies");
const OperationHttpHandler_1 = require("./OperationHttpHandler");
const { blankNode, namedNode, literal } = n3_1.DataFactory;
/**
 * Handles all the necessary steps for an authorization.
 * Errors if authorization fails, otherwise passes the parameter to the operationHandler handler.
 * The following steps are executed:
 *  - Extracting credentials from the request.
 *  - Extracting the required permissions.
 *  - Reading the allowed permissions for the credentials.
 *  - Validating if this operation is allowed.
 */
class AuthorizingHttpHandler extends OperationHttpHandler_1.OperationHttpHandler {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    credentialsExtractor;
    modesExtractor;
    permissionReader;
    authorizer;
    operationHandler;
    constructor(args) {
        super();
        this.credentialsExtractor = args.credentialsExtractor;
        this.modesExtractor = args.modesExtractor;
        this.permissionReader = args.permissionReader;
        this.authorizer = args.authorizer;
        this.operationHandler = args.operationHandler;
    }
    async handle(input) {
        const { request, operation } = input;
        const credentials = await this.credentialsExtractor.handleSafe(request);
        this.logger.verbose(`Extracted credentials: ${JSON.stringify(credentials)}`);
        const requestedModes = await this.modesExtractor.handleSafe(operation);
        this.logger.verbose(`Retrieved required modes: ${[...requestedModes.entrySets()]
            .map(([id, set]) => `{ ${id.path}: ${[...set].join(',')} }`).join(',')}`);
        const availablePermissions = await this.permissionReader.handleSafe({ credentials, requestedModes });
        this.logger.verbose(`Available permissions are ${[...availablePermissions.entries()]
            .map(([id, map]) => `{ ${id.path}: ${JSON.stringify(map)} }`).join(',')}`);
        try {
            await this.authorizer.handleSafe({ credentials, requestedModes, availablePermissions });
        }
        catch (error) {
            this.logger.verbose(`Authorization failed: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            if (HttpError_1.HttpError.isInstance(error)) {
                this.addAccessModesToError(error, requestedModes);
            }
            throw error;
        }
        this.logger.verbose(`Authorization succeeded, calling source handler`);
        return this.operationHandler.handleSafe(input);
    }
    addAccessModesToError(error, requestedModes) {
        for (const [identifier, modes] of requestedModes.entrySets()) {
            const bnode = blankNode();
            error.metadata.add(Vocabularies_1.SOLID_META.terms.requestedAccess, bnode);
            error.metadata.addQuad(bnode, Vocabularies_1.SOLID_META.terms.accessTarget, namedNode(identifier.path));
            for (const mode of modes.values()) {
                error.metadata.addQuad(bnode, Vocabularies_1.SOLID_META.terms.accessMode, literal(mode));
            }
        }
    }
}
exports.AuthorizingHttpHandler = AuthorizingHttpHandler;
//# sourceMappingURL=AuthorizingHttpHandler.js.map