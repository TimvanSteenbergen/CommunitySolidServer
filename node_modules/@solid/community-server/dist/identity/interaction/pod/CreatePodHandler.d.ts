import type { JsonRepresentation } from '../InteractionUtil';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import type { JsonView } from '../JsonView';
import type { WebIdLinkRoute } from '../webid/WebIdLinkRoute';
import type { PodIdRoute } from './PodIdRoute';
import type { PodCreator } from './util/PodCreator';
import type { PodStore } from './util/PodStore';
type OutType = {
    pod: string;
    podResource: string;
    webId: string;
    webIdResource?: string;
};
/**
 * Handles the creation of pods.
 * Will call the stored {@link PodCreator} with the settings found in the input JSON.
 */
export declare class CreatePodHandler extends JsonInteractionHandler<OutType> implements JsonView {
    private readonly logger;
    private readonly podStore;
    private readonly podCreator;
    private readonly webIdLinkRoute;
    private readonly podIdRoute;
    private readonly inSchema;
    constructor(podStore: PodStore, podCreator: PodCreator, webIdLinkRoute: WebIdLinkRoute, podIdRoute: PodIdRoute, allowRoot?: boolean);
    getView({ accountId }: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
    handle({ json, accountId }: JsonInteractionHandlerInput): Promise<JsonRepresentation<OutType>>;
}
export {};
