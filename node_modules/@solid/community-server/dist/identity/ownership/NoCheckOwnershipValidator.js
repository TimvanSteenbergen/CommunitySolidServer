"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoCheckOwnershipValidator = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const OwnershipValidator_1 = require("./OwnershipValidator");
/**
 * Does not do any checks to verify if the agent doing the request is actually the owner of the WebID.
 * This should only be used for debugging.
 */
class NoCheckOwnershipValidator extends OwnershipValidator_1.OwnershipValidator {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    async handle({ webId }) {
        this.logger.info(`Agent unsecurely claims to own ${webId}`);
    }
}
exports.NoCheckOwnershipValidator = NoCheckOwnershipValidator;
//# sourceMappingURL=NoCheckOwnershipValidator.js.map