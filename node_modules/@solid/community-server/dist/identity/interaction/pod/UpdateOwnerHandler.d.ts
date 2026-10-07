import type { ResourceIdentifier } from '../../../http/representation/ResourceIdentifier';
import type { EmptyObject } from '../../../util/map/MapUtil';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { JsonView } from '../JsonView';
import type { PodIdRoute } from './PodIdRoute';
import type { PodStore } from './util/PodStore';
/**
 * Responsible for adding/updating/deleting owners in pods.
 */
export declare class UpdateOwnerHandler extends JsonInteractionHandler implements JsonView {
    private readonly podStore;
    private readonly podRoute;
    constructor(podStore: PodStore, podRoute: PodIdRoute);
    getView({ accountId, target }: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation<EmptyObject>>;
    /**
     * Extract the pod ID from the path and find the associated pod.
     * Asserts that the given account ID is the creator of this pod.
     */
    protected findVerifiedPod(target: ResourceIdentifier, accountId?: string): Promise<{
        id: string;
        baseUrl: string;
        accountId: string;
    }>;
}
