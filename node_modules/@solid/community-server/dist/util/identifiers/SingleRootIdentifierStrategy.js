"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleRootIdentifierStrategy = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const PathUtil_1 = require("../PathUtil");
const BaseIdentifierStrategy_1 = require("./BaseIdentifierStrategy");
/**
 * An IdentifierStrategy that assumes there is only 1 root and all other identifiers are made by appending to that root.
 */
class SingleRootIdentifierStrategy extends BaseIdentifierStrategy_1.BaseIdentifierStrategy {
    baseUrl;
    logger = (0, LogUtil_1.getLoggerFor)(this);
    constructor(baseUrl) {
        super();
        this.baseUrl = (0, PathUtil_1.ensureTrailingSlash)(baseUrl);
    }
    supportsIdentifier(identifier) {
        const supported = identifier.path.startsWith(this.baseUrl);
        this.logger.debug(supported ?
            `Identifier ${identifier.path} is part of ${this.baseUrl}` :
            `Identifier ${identifier.path} is not part of ${this.baseUrl}`);
        return supported;
    }
    isRootContainer(identifier) {
        return identifier.path === this.baseUrl;
    }
}
exports.SingleRootIdentifierStrategy = SingleRootIdentifierStrategy;
//# sourceMappingURL=SingleRootIdentifierStrategy.js.map