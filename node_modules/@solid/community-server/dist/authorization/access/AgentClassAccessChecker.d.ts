import type { AccessCheckerArgs } from './AccessChecker';
import { AccessChecker } from './AccessChecker';
/**
 * Checks access based on the agent class.
 */
export declare class AgentClassAccessChecker extends AccessChecker {
    handle({ acl, rule, credentials }: AccessCheckerArgs): Promise<boolean>;
}
