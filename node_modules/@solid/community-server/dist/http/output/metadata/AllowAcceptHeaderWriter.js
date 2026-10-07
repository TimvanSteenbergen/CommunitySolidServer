"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowAcceptHeaderWriter = void 0;
const MethodNotAllowedHttpError_1 = require("../../../util/errors/MethodNotAllowedHttpError");
const NotFoundHttpError_1 = require("../../../util/errors/NotFoundHttpError");
const UnsupportedMediaTypeHttpError_1 = require("../../../util/errors/UnsupportedMediaTypeHttpError");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const PathUtil_1 = require("../../../util/PathUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataWriter_1 = require("./MetadataWriter");
var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["document"] = 0] = "document";
    ResourceType[ResourceType["container"] = 1] = "container";
    ResourceType[ResourceType["unknown"] = 2] = "unknown";
})(ResourceType || (ResourceType = {}));
/**
 * Generates Allow, Accept-Patch, Accept-Post, and Accept-Put headers.
 * The resulting values depend on the choses input methods and types.
 * The input metadata also gets used to remove methods from that list
 * if they are not valid in the given situation.
 */
class AllowAcceptHeaderWriter extends MetadataWriter_1.MetadataWriter {
    supportedMethods;
    acceptTypes;
    constructor(supportedMethods, acceptTypes) {
        super();
        this.supportedMethods = supportedMethods;
        this.acceptTypes = { patch: [], post: [], put: [], ...acceptTypes };
    }
    async handle(input) {
        const { response, metadata } = input;
        let resourceType;
        if (metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.Resource)) {
            resourceType = (0, PathUtil_1.isContainerPath)(metadata.identifier.value) ? ResourceType.container : ResourceType.document;
        }
        else {
            const target = metadata.get(Vocabularies_1.SOLID_ERROR.terms.target)?.value;
            if (target) {
                resourceType = (0, PathUtil_1.isContainerPath)(target) ? ResourceType.container : ResourceType.document;
            }
            else {
                resourceType = ResourceType.unknown;
            }
        }
        // Filter out methods which are not allowed
        const allowedMethods = this.filterAllowedMethods(metadata, resourceType);
        // Generate the Allow headers (if required)
        const generateAllow = this.generateAllow(allowedMethods, response, metadata);
        // Generate Accept-[Method] headers (if required)
        this.generateAccept(allowedMethods, generateAllow, response, metadata);
    }
    /**
     * Starts from the stored set of methods and removes all those that are not allowed based on the metadata.
     */
    filterAllowedMethods(metadata, resourceType) {
        const disallowedMethods = new Set(metadata.getAll(Vocabularies_1.SOLID_ERROR.terms.disallowedMethod)
            .map((term) => term.value));
        const allowedMethods = new Set(this.supportedMethods.filter((method) => !disallowedMethods.has(method)));
        // POST is only allowed on containers.
        // Metadata only has the resource URI in case it has resource metadata.
        if (!this.isPostAllowed(resourceType)) {
            allowedMethods.delete('POST');
        }
        if (!this.isPutAllowed(metadata, resourceType)) {
            allowedMethods.delete('PUT');
        }
        if (!this.isPatchAllowed(resourceType)) {
            allowedMethods.delete('PATCH');
        }
        if (!this.isDeleteAllowed(metadata, resourceType)) {
            allowedMethods.delete('DELETE');
        }
        // If we are sure the resource does not exist: only keep methods that can create a new resource.
        if (metadata.has(Vocabularies_1.SOLID_ERROR.terms.errorResponse, NotFoundHttpError_1.NotFoundHttpError.uri)) {
            for (const method of allowedMethods) {
                // Containers can only be created by PUT; documents by PUT or PATCH
                if (method !== 'PUT' && (method !== 'PATCH' || resourceType === ResourceType.container)) {
                    allowedMethods.delete(method);
                }
            }
        }
        return allowedMethods;
    }
    /**
     * POST is only allowed on containers.
     */
    isPostAllowed(resourceType) {
        return resourceType !== ResourceType.document;
    }
    /**
     * PUT is not allowed on description resources or existing containers.
     */
    isPutAllowed(metadata, resourceType) {
        return !metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.SOLID_META.terms.DescriptionResource) &&
            (resourceType !== ResourceType.container || !metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.Resource));
    }
    /**
     * PATCH is not allowed on containers.
     */
    isPatchAllowed(resourceType) {
        return resourceType !== ResourceType.container;
    }
    /**
     * DELETE is allowed if the target exists,
     * is not a container or description resource,
     * or is an empty container that isn't a storage.
     *
     * Note that the identifier value check only works if the metadata is not about an error.
     */
    isDeleteAllowed(metadata, resourceType) {
        if (metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.SOLID_META.terms.DescriptionResource)) {
            return false;
        }
        if (resourceType !== ResourceType.container) {
            return true;
        }
        const isStorage = metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.PIM.terms.Storage);
        const isEmpty = !metadata.has(Vocabularies_1.LDP.terms.contains);
        return !isStorage && isEmpty;
    }
    /**
     * Generates the Allow header if required.
     * It only needs to get added for successful GET/HEAD requests, 404s, or 405s.
     * The spec only requires it for GET/HEAD requests and 405s.
     * In the case of other error messages we can't deduce what the request method was,
     * so we do not add the header as we don't have enough information.
     */
    generateAllow(methods, response, metadata) {
        const methodDisallowed = metadata.has(Vocabularies_1.SOLID_ERROR.terms.errorResponse, MethodNotAllowedHttpError_1.MethodNotAllowedHttpError.uri);
        // 405s indicate the target resource exists.
        // This is a heuristic, but one that should always be correct in our case.
        const resourceExists = methodDisallowed || metadata.has(Vocabularies_1.RDF.terms.type, Vocabularies_1.LDP.terms.Resource);
        const generateAllow = resourceExists || metadata.has(Vocabularies_1.SOLID_ERROR.terms.errorResponse, NotFoundHttpError_1.NotFoundHttpError.uri);
        if (generateAllow) {
            (0, HeaderUtil_1.addHeader)(response, 'Allow', [...methods].join(', '));
        }
        return generateAllow;
    }
    /**
     * Generates the Accept-[Method] headers if required.
     * Will be added if the Allow header was added, or in case of a 415 error.
     * Specific Accept-[Method] headers will only be added if the method is in the `methods` set.
     */
    generateAccept(methods, generateAllow, response, metadata) {
        const typeWasUnsupported = metadata.has(Vocabularies_1.SOLID_ERROR.terms.errorResponse, UnsupportedMediaTypeHttpError_1.UnsupportedMediaTypeHttpError.uri);
        const generateAccept = generateAllow || typeWasUnsupported;
        if (generateAccept) {
            if (methods.has('PATCH')) {
                (0, HeaderUtil_1.addHeader)(response, 'Accept-Patch', this.acceptTypes.patch.join(', '));
            }
            if (methods.has('POST')) {
                (0, HeaderUtil_1.addHeader)(response, 'Accept-Post', this.acceptTypes.post.join(', '));
            }
            if (methods.has('PUT')) {
                (0, HeaderUtil_1.addHeader)(response, 'Accept-Put', this.acceptTypes.put.join(', '));
            }
        }
    }
}
exports.AllowAcceptHeaderWriter = AllowAcceptHeaderWriter;
//# sourceMappingURL=AllowAcceptHeaderWriter.js.map