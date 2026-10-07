import type { AccessCheckerArgs } from './AccessChecker';
import { AccessChecker } from './AccessChecker';
/**
 * Checks if the given WebID has been given access.
 */
export declare class AgentAccessChecker extends AccessChecker {
    handle({ acl, rule, credentials }: AccessCheckerArgs): Promise<boolean>;
}
