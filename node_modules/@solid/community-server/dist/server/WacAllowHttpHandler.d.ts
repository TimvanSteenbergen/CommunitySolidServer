import type { CredentialsExtractor } from '../authentication/CredentialsExtractor';
import type { PermissionReader } from '../authorization/PermissionReader';
import type { ModesExtractor } from '../authorization/permissions/ModesExtractor';
import type { ResponseDescription } from '../http/output/response/ResponseDescription';
import type { OperationHttpHandlerInput } from './OperationHttpHandler';
import { OperationHttpHandler } from './OperationHttpHandler';
export interface WacAllowHttpHandlerArgs {
    credentialsExtractor: CredentialsExtractor;
    modesExtractor: ModesExtractor;
    permissionReader: PermissionReader;
    operationHandler: OperationHttpHandler;
}
/**
 * Adds all the available permissions to the response metadata,
 * which can be used to generate the correct WAC-Allow header.
 *
 * This class does many things similar to the {@link AuthorizingHttpHandler},
 * so in general it is a good idea to make sure all these classes cache their results.
 */
export declare class WacAllowHttpHandler extends OperationHttpHandler {
    private readonly logger;
    private readonly credentialsExtractor;
    private readonly modesExtractor;
    private readonly permissionReader;
    private readonly operationHandler;
    constructor(args: WacAllowHttpHandlerArgs);
    handle(input: OperationHttpHandlerInput): Promise<ResponseDescription>;
    /**
     * Converts the found permissions to triples and puts them in the metadata.
     */
    private addWacAllowMetadata;
}
