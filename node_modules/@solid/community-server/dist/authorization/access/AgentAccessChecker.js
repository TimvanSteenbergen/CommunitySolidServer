"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentAccessChecker = void 0;
const Vocabularies_1 = require("../../util/Vocabularies");
const AccessChecker_1 = require("./AccessChecker");
/**
 * Checks if the given WebID has been given access.
 */
class AgentAccessChecker extends AccessChecker_1.AccessChecker {
    async handle({ acl, rule, credentials }) {
        if (typeof credentials.agent?.webId === 'string') {
            return acl.countQuads(rule, Vocabularies_1.ACL.terms.agent, credentials.agent.webId, null) !== 0;
        }
        return false;
    }
}
exports.AgentAccessChecker = AgentAccessChecker;
//# sourceMappingURL=AgentAccessChecker.js.map