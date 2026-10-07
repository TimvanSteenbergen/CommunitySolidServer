import type { interactionPolicy } from '../../../templates/types/oidc-provider';
import { AsyncHandler } from '../../util/handlers/AsyncHandler';
/**
 * Used to generate custom {@link interactionPolicy.Prompt}s.
 */
export declare abstract class PromptFactory extends AsyncHandler<interactionPolicy.DefaultPolicy> {
}
