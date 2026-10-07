"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAclReader = void 0;
const n3_1 = require("n3");
const LogUtil_1 = require("../logging/LogUtil");
const ContentTypes_1 = require("../util/ContentTypes");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const ForbiddenHttpError_1 = require("../util/errors/ForbiddenHttpError");
const InternalServerError_1 = require("../util/errors/InternalServerError");
const IdentifierMap_1 = require("../util/map/IdentifierMap");
const StreamUtil_1 = require("../util/StreamUtil");
const Vocabularies_1 = require("../util/Vocabularies");
const PermissionReader_1 = require("./PermissionReader");
const AclPermissionSet_1 = require("./permissions/AclPermissionSet");
const Permissions_1 = require("./permissions/Permissions");
// Maps WebACL-specific modes to generic access modes.
const modesMap = {
    [Vocabularies_1.ACL.Read]: [Permissions_1.AccessMode.read],
    [Vocabularies_1.ACL.Write]: [Permissions_1.AccessMode.append, Permissions_1.AccessMode.write],
    [Vocabularies_1.ACL.Append]: [Permissions_1.AccessMode.append],
    [Vocabularies_1.ACL.Control]: [AclPermissionSet_1.AclMode.control],
};
/**
 * Finds the permissions of a resource as defined in the corresponding ACL resource.
 * Does not make any deductions such as checking parent containers for create permissions
 * or applying control permissions for ACL resources.
 *
 * Specific access checks are done by the provided {@link AccessChecker}.
 */
class WebAclReader extends PermissionReader_1.PermissionReader {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    aclStrategy;
    resourceSet;
    aclStore;
    identifierStrategy;
    accessChecker;
    constructor(aclStrategy, resourceSet, aclStore, identifierStrategy, accessChecker) {
        super();
        this.aclStrategy = aclStrategy;
        this.resourceSet = resourceSet;
        this.aclStore = aclStore;
        this.identifierStrategy = identifierStrategy;
        this.accessChecker = accessChecker;
    }
    /**
     * Checks if an agent is allowed to execute the requested actions.
     * Will throw an error if this is not the case.
     */
    async handle({ credentials, requestedModes }) {
        // Determine the required access modes
        this.logger.debug(`Retrieving permissions of ${credentials.agent?.webId ?? 'an unknown agent'}`);
        const aclMap = await this.getAclMatches(requestedModes.distinctKeys());
        const storeMap = await this.findAuthorizationStatements(aclMap);
        return this.findPermissions(storeMap, credentials);
    }
    /**
     * Finds the permissions in the provided WebACL quads.
     *
     * Rather than restricting the search to only the required modes,
     * we collect all modes in order to have complete metadata (for instance, for the WAC-Allow header).
     *
     * @param aclMap - A map containing stores of ACL data linked to their relevant identifiers.
     * @param credentials - Credentials to check permissions for.
     */
    async findPermissions(aclMap, credentials) {
        const result = new IdentifierMap_1.IdentifierMap();
        for (const [store, aclIdentifiers] of aclMap) {
            const permissionSet = await this.determinePermissions(store, credentials);
            for (const identifier of aclIdentifiers) {
                result.set(identifier, permissionSet);
            }
        }
        return result;
    }
    /**
     * Determines the available permissions for the given credentials.
     *
     * @param acl - Store containing all relevant authorization triples.
     * @param credentials - Credentials to find the permissions for.
     */
    async determinePermissions(acl, credentials) {
        const aclPermissions = {};
        // Apply all ACL rules
        const aclRules = acl.getSubjects(Vocabularies_1.RDF.type, Vocabularies_1.ACL.Authorization, null);
        for (const rule of aclRules) {
            const hasAccess = await this.accessChecker.handleSafe({ acl, rule, credentials });
            if (hasAccess) {
                // Set all allowed modes to true
                const modes = acl.getObjects(rule, Vocabularies_1.ACL.mode, null);
                for (const { value: aclMode } of modes) {
                    if (aclMode in modesMap) {
                        for (const mode of modesMap[aclMode]) {
                            aclPermissions[mode] = true;
                        }
                    }
                }
            }
        }
        return aclPermissions;
    }
    /**
     * Finds the ACL data relevant for all the given resources.
     * The input set will be modified in place.
     *
     * @param targets - Targets to find ACL data for.
     *
     * @returns A map linking ACL resources to the relevant identifiers.
     */
    async getAclMatches(targets) {
        const aclMap = new IdentifierMap_1.IdentifierSetMultiMap();
        for (const target of targets) {
            this.logger.debug(`Searching ACL data for ${target.path}`);
            const aclIdentifier = await this.getAclRecursive(target);
            aclMap.add(aclIdentifier, target);
        }
        return aclMap;
    }
    /**
     * Finds the ACL document relevant for the given identifier,
     * following the steps defined in https://solidproject.org/TR/2021/wac-20210711#effective-acl-resource.
     *
     * @param identifier - {@link ResourceIdentifier} of which we need the ACL document.
     *
     * @returns The {@link ResourceIdentifier} of the relevant ACL document.
     */
    async getAclRecursive(identifier) {
        // Obtain the direct ACL document for the resource, if it exists
        this.logger.debug(`Trying to read the direct ACL document of ${identifier.path}`);
        const acl = this.aclStrategy.getAuxiliaryIdentifier(identifier);
        this.logger.debug(`Determining existence of  ${acl.path}`);
        if (await this.resourceSet.hasResource(acl)) {
            this.logger.info(`Found applicable ACL document ${acl.path}`);
            return acl;
        }
        this.logger.debug(`No direct ACL document found for ${identifier.path}`);
        // Find the applicable ACL document of the parent container
        this.logger.debug(`Traversing to the parent of ${identifier.path}`);
        if (this.identifierStrategy.isRootContainer(identifier)) {
            this.logger.error(`No ACL document found for root container ${identifier.path}`);
            // https://solidproject.org/TR/2021/wac-20210711#acl-resource-representation
            // The root container MUST have an ACL resource with a representation.
            throw new ForbiddenHttpError_1.ForbiddenHttpError('No ACL document found for root container');
        }
        const parent = this.identifierStrategy.getParentContainer(identifier);
        return this.getAclRecursive(parent);
    }
    /**
     * For every ACL/identifier combination it finds the relevant ACL triples for that identifier.
     * This is done in such a way that store results are reused for all matching identifiers.
     * The split is based on the `acl:accessTo` and `acl:default` triples.
     *
     * @param map - Map of matches that need to be filtered.
     */
    async findAuthorizationStatements(map) {
        // For every found ACL document, filter out triples that match for specific identifiers
        const result = new Map();
        for (const [aclIdentifier, matchedTargets] of map.entrySets()) {
            const subject = this.aclStrategy.getSubjectIdentifier(aclIdentifier);
            this.logger.debug(`Trying to read the ACL document ${aclIdentifier.path}`);
            let contents;
            try {
                const data = await this.aclStore.getRepresentation(aclIdentifier, { type: { [ContentTypes_1.INTERNAL_QUADS]: 1 } });
                contents = await (0, StreamUtil_1.readableToQuads)(data.data);
            }
            catch (error) {
                // Something is wrong with the server if we can't read the resource
                const message = `Error reading ACL resource ${aclIdentifier.path}: ${(0, ErrorUtil_1.createErrorMessage)(error)}`;
                this.logger.error(message);
                throw new InternalServerError_1.InternalServerError(message, { cause: error });
            }
            // SubjectIdentifiers are those that match the subject identifier of the found ACL document (so max 1).
            // Due to how the effective ACL document is found, all other identifiers must be (transitive) children.
            // This has impact on whether the `acl:accessTo` or `acl:default` predicate needs to be checked.
            const subjectIdentifiers = [];
            const childIdentifiers = [];
            for (const target of matchedTargets) {
                (target.path === subject.path ? subjectIdentifiers : childIdentifiers).push(target);
            }
            if (subjectIdentifiers.length > 0) {
                const subjectStore = await this.filterStore(contents, subject.path, true);
                result.set(subjectStore, subjectIdentifiers);
            }
            if (childIdentifiers.length > 0) {
                const childStore = await this.filterStore(contents, subject.path, false);
                result.set(childStore, childIdentifiers);
            }
        }
        return result;
    }
    /**
     * Extracts all rules from the store that are relevant for the given target,
     * based on either the `acl:accessTo` or `acl:default` predicates.
     *
     * @param store - Store to filter.
     * @param target - The identifier of which the acl rules need to be known.
     * @param directAcl - If the store contains triples from the direct acl resource of the target or not.
     *                    Determines if `acl:accessTo` or `acl:default` are used.
     *
     * @returns A store containing the relevant triples for the given target.
     */
    async filterStore(store, target, directAcl) {
        // Find subjects that occur with a given predicate/object, and collect all their triples
        const subjectData = new n3_1.Store();
        const subjects = store.getSubjects(directAcl ? Vocabularies_1.ACL.terms.accessTo : Vocabularies_1.ACL.terms.default, target, null);
        for (const subject of subjects) {
            subjectData.addQuads(store.getQuads(subject, null, null, null));
        }
        return subjectData;
    }
}
exports.WebAclReader = WebAclReader;
//# sourceMappingURL=WebAclReader.js.map