import type { CredentialsExtractor } from '../authentication/CredentialsExtractor';
import type { Authorizer } from '../authorization/Authorizer';
import type { PermissionReader } from '../authorization/PermissionReader';
import type { ModesExtractor } from '../authorization/permissions/ModesExtractor';
import type { ResponseDescription } from '../http/output/response/ResponseDescription';
import type { OperationHttpHandlerInput } from './OperationHttpHandler';
import { OperationHttpHandler } from './OperationHttpHandler';
export interface AuthorizingHttpHandlerArgs {
    /**
     * Extracts the credentials from the incoming request.
     */
    credentialsExtractor: CredentialsExtractor;
    /**
     * Extracts the required modes from the generated Operation.
     */
    modesExtractor: ModesExtractor;
    /**
     * Reads the permissions available for the Operation.
     */
    permissionReader: PermissionReader;
    /**
     * Verifies if the requested operation is allowed.
     */
    authorizer: Authorizer;
    /**
     * Handler to call if the operation is authorized.
     */
    operationHandler: OperationHttpHandler;
}
/**
 * Handles all the necessary steps for an authorization.
 * Errors if authorization fails, otherwise passes the parameter to the operationHandler handler.
 * The following steps are executed:
 *  - Extracting credentials from the request.
 *  - Extracting the required permissions.
 *  - Reading the allowed permissions for the credentials.
 *  - Validating if this operation is allowed.
 */
export declare class AuthorizingHttpHandler extends OperationHttpHandler {
    private readonly logger;
    private readonly credentialsExtractor;
    private readonly modesExtractor;
    private readonly permissionReader;
    private readonly authorizer;
    private readonly operationHandler;
    constructor(args: AuthorizingHttpHandlerArgs);
    handle(input: OperationHttpHandlerInput): Promise<ResponseDescription>;
    private addAccessModesToError;
}
