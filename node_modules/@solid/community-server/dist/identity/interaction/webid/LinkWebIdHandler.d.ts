import type { StorageLocationStrategy } from '../../../server/description/StorageLocationStrategy';
import type { OwnershipValidator } from '../../ownership/OwnershipValidator';
import type { JsonRepresentation } from '../InteractionUtil';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import type { JsonView } from '../JsonView';
import type { PodStore } from '../pod/util/PodStore';
import type { WebIdStore } from './util/WebIdStore';
import type { WebIdLinkRoute } from './WebIdLinkRoute';
type OutType = {
    resource: string;
    webId: string;
    oidcIssuer: string;
};
export interface LinkWebIdHandlerArgs {
    /**
     * Base URL of the server.
     * Used to indicate in the response what the object of the `solid:oidcIssuer` triple should be.
     */
    baseUrl: string;
    /**
     * Validates whether the user trying to link the WebID is the actual owner of that WebID.
     */
    ownershipValidator: OwnershipValidator;
    /**
     * Pod store to find out if the account created the pod containing the WebID.
     */
    podStore: PodStore;
    /**
     * WebID store to store WebID links.
     */
    webIdStore: WebIdStore;
    /**
     * Route used to generate the WebID link resource URL.
     */
    webIdRoute: WebIdLinkRoute;
    /**
     * Before calling the {@link OwnershipValidator}, we first check if the target WebID is in a pod owned by the user.
     */
    storageStrategy: StorageLocationStrategy;
}
/**
 * Handles the linking of WebIDs to account,
 * thereby registering them to the server IDP.
 */
export declare class LinkWebIdHandler extends JsonInteractionHandler<OutType> implements JsonView {
    private readonly logger;
    private readonly baseUrl;
    private readonly ownershipValidator;
    private readonly podStore;
    private readonly webIdStore;
    private readonly webIdRoute;
    private readonly storageStrategy;
    constructor(args: LinkWebIdHandlerArgs);
    getView({ accountId }: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
    handle({ accountId, json }: JsonInteractionHandlerInput): Promise<JsonRepresentation<OutType>>;
}
export {};
