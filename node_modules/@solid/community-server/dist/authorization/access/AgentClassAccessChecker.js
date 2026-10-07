"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentClassAccessChecker = void 0;
const Vocabularies_1 = require("../../util/Vocabularies");
const AccessChecker_1 = require("./AccessChecker");
/**
 * Checks access based on the agent class.
 */
class AgentClassAccessChecker extends AccessChecker_1.AccessChecker {
    async handle({ acl, rule, credentials }) {
        // Check if unauthenticated agents have access
        if (acl.countQuads(rule, Vocabularies_1.ACL.terms.agentClass, Vocabularies_1.FOAF.terms.Agent, null) !== 0) {
            return true;
        }
        // Check if the agent is authenticated and if authenticated agents have access
        if (typeof credentials.agent?.webId === 'string') {
            return acl.countQuads(rule, Vocabularies_1.ACL.terms.agentClass, Vocabularies_1.ACL.terms.AuthenticatedAgent, null) !== 0;
        }
        return false;
    }
}
exports.AgentClassAccessChecker = AgentClassAccessChecker;
//# sourceMappingURL=AgentClassAccessChecker.js.map