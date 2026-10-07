"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubdomainExtensionBasedMapper = void 0;
const punycode_1 = require("punycode/");
const ForbiddenHttpError_1 = require("../../util/errors/ForbiddenHttpError");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const ExtensionBasedMapper_1 = require("./ExtensionBasedMapper");
/**
 * Extends the functionality of an {@link ExtensionBasedMapper} to support identifiers containing subdomains.
 * This is mostly only relevant in case you want to support multiple pods with subdomain identifiers
 * in a single ResourceStore.
 *
 * When converting to/from file paths, the subdomain is interpreted as a folder in the rootFilePath.
 * The rest of the path is then interpreted relative to that folder.
 * E.g. `http://alice.test.com/foo` results in the relative path `/alice/foo`.
 *
 * In case there is no subdomain in the URL, the `baseSubdomain` parameter is used instead.
 * E.g., if the `baseSubdomain` is "www", `http://test.com/foo` would result in the relative path `/www/foo`.
 * This means that there is no identifier that maps to the `rootFilePath` itself.
 * To prevent the possibility of 2 identifiers linking to the same file,
 * identifiers containing the default subdomain are rejected.
 * E.g., `http://www.test.com/foo` would result in a 403, even if `http://test.com/foo` exists.
 */
class SubdomainExtensionBasedMapper extends ExtensionBasedMapper_1.ExtensionBasedMapper {
    baseSubdomain;
    regex;
    baseParts;
    constructor(base, rootFilepath, baseSubdomain = 'www', customTypes) {
        super(base, rootFilepath, customTypes);
        this.baseSubdomain = baseSubdomain;
        this.regex = (0, PathUtil_1.createSubdomainRegexp)((0, PathUtil_1.ensureTrailingSlash)(base));
        this.baseParts = (0, PathUtil_1.extractScheme)((0, PathUtil_1.ensureTrailingSlash)(base));
    }
    async getContainerUrl(relative) {
        return (0, PathUtil_1.ensureTrailingSlash)(this.relativeToUrl(relative));
    }
    async getDocumentUrl(relative) {
        relative = this.stripExtension(relative);
        return (0, PathUtil_1.trimTrailingSlashes)(this.relativeToUrl(relative));
    }
    /**
     * Converts a relative path to a URL.
     * Examples assuming http://test.com/ is the base url and `www` the base subdomain:
     *  * /www/foo gives http://test.com/foo
     *  * /alice/foo/ gives http://alice.test.com/foo/
     */
    relativeToUrl(relative) {
        const match = /^\/([^/]+)\/(.*)$/u.exec(relative);
        if (!Array.isArray(match)) {
            throw new InternalServerError_1.InternalServerError(`Illegal relative path ${relative}`);
        }
        const tail = (0, PathUtil_1.encodeUriPathComponents)(match[2]);
        if (match[1] === this.baseSubdomain) {
            return `${this.baseRequestURI}/${tail}`;
        }
        return `${this.baseParts.scheme}${(0, punycode_1.toASCII)(match[1])}.${this.baseParts.rest}${tail}`;
    }
    /**
     * Gets the relative path as though the subdomain url is the base, and then prepends it with the subdomain.
     * Examples assuming http://test.com/ is the base url and `www` the base subdomain:
     *  * http://test.com/foo gives /www/foo
     *  * http://alice.test.com/foo/ gives /alice/foo/
     */
    getRelativePath(identifier) {
        const match = this.regex.exec(identifier.path);
        if (!Array.isArray(match)) {
            this.logger.warn(`The URL ${identifier.path} is outside of the scope ${this.baseRequestURI}`);
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        // Otherwise 2 different identifiers would be able to access the same resource
        if (match[1] === this.baseSubdomain) {
            throw new ForbiddenHttpError_1.ForbiddenHttpError(`Subdomain ${this.baseSubdomain} can not be used.`);
        }
        const tail = `/${(0, PathUtil_1.decodeUriPathComponents)(identifier.path.slice(match[0].length))}`;
        const subdomain = match[1] ? (0, punycode_1.toUnicode)(match[1]) : this.baseSubdomain;
        return `/${subdomain}${tail}`;
    }
}
exports.SubdomainExtensionBasedMapper = SubdomainExtensionBasedMapper;
//# sourceMappingURL=SubdomainExtensionBasedMapper.js.map