import type { AccessCheckerArgs } from './AccessChecker';
import { AccessChecker } from './AccessChecker';
/**
 * Checks if the given WebID belongs to a group that has access.
 * Implements the behaviour of groups from the WAC specification.
 */
export declare class AgentGroupAccessChecker extends AccessChecker {
    constructor();
    handle({ acl, rule, credentials }: AccessCheckerArgs): Promise<boolean>;
    /**
     * Checks if the given agent is member of a given vCard group.
     *
     * @param webId - WebID of the agent that needs access.
     * @param group - URL of the vCard group that needs to be checked.
     *
     * @returns If the agent is member of the given vCard group.
     */
    private isMemberOfGroup;
    /**
     * Fetches quads from the given URL.
     */
    private fetchQuads;
}
