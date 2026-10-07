import type { ResourceIdentifier } from '../../../http/representation/ResourceIdentifier';
import type { PodSettings } from '../../settings/PodSettings';
import { VariableHandler } from './VariableHandler';
/**
 * Adds the pod identifier as base url variable to the agent.
 * This allows for config templates that require a value for TEMPLATE_BASE_URL_URN,
 * which should equal the pod identifier.
 */
export declare class BaseUrlHandler extends VariableHandler {
    handle({ identifier, settings }: {
        identifier: ResourceIdentifier;
        settings: PodSettings;
    }): Promise<void>;
}
