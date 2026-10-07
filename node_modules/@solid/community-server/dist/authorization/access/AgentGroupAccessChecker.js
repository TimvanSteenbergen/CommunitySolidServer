"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentGroupAccessChecker = void 0;
const FetchUtil_1 = require("../../util/FetchUtil");
const PromiseUtil_1 = require("../../util/PromiseUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const AccessChecker_1 = require("./AccessChecker");
/**
 * Checks if the given WebID belongs to a group that has access.
 * Implements the behaviour of groups from the WAC specification.
 */
class AgentGroupAccessChecker extends AccessChecker_1.AccessChecker {
    constructor() {
        super();
    }
    async handle({ acl, rule, credentials }) {
        if (typeof credentials.agent?.webId === 'string') {
            const { webId } = credentials.agent;
            const groups = acl.getObjects(rule, Vocabularies_1.ACL.terms.agentGroup, null);
            return (0, PromiseUtil_1.promiseSome)(groups.map(async (group) => this.isMemberOfGroup(webId, group)));
        }
        return false;
    }
    /**
     * Checks if the given agent is member of a given vCard group.
     *
     * @param webId - WebID of the agent that needs access.
     * @param group - URL of the vCard group that needs to be checked.
     *
     * @returns If the agent is member of the given vCard group.
     */
    async isMemberOfGroup(webId, group) {
        const groupDocument = { path: /^[^#]*/u.exec(group.value)[0] };
        // Fetch the required vCard group file
        const quads = await this.fetchQuads(groupDocument.path);
        return quads.countQuads(group, Vocabularies_1.VCARD.terms.hasMember, webId, null) !== 0;
    }
    /**
     * Fetches quads from the given URL.
     */
    async fetchQuads(url) {
        const prom = (async () => {
            const representation = await (0, FetchUtil_1.fetchDataset)(url);
            return (0, StreamUtil_1.readableToQuads)(representation.data);
        })();
        return prom;
    }
}
exports.AgentGroupAccessChecker = AgentGroupAccessChecker;
//# sourceMappingURL=AgentGroupAccessChecker.js.map