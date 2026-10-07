"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubdomainIdentifierStrategy = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const PathUtil_1 = require("../PathUtil");
const BaseIdentifierStrategy_1 = require("./BaseIdentifierStrategy");
/**
 * An IdentifierStrategy that interprets all subdomains of the given base URL as roots.
 */
class SubdomainIdentifierStrategy extends BaseIdentifierStrategy_1.BaseIdentifierStrategy {
    baseUrl;
    regex;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(baseUrl) {
        super();
        this.baseUrl = (0, PathUtil_1.ensureTrailingSlash)(baseUrl);
        this.regex = (0, PathUtil_1.createSubdomainRegexp)(this.baseUrl);
    }
    supportsIdentifier(identifier) {
        const supported = this.regex.test(identifier.path);
        this.logger.debug(supported ?
            `Identifier ${identifier.path} is part of ${this.baseUrl}` :
            `Identifier ${identifier.path} is not part of ${this.baseUrl}`);
        return supported;
    }
    isRootContainer(identifier) {
        const match = this.regex.exec(identifier.path);
        return Array.isArray(match) && match[0].length === identifier.path.length;
    }
}
exports.SubdomainIdentifierStrategy = SubdomainIdentifierStrategy;
//# sourceMappingURL=SubdomainIdentifierStrategy.js.map