"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcpHeaderHandler = void 0;
const HeaderUtil_1 = require("../../util/HeaderUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const HttpHandler_1 = require("../HttpHandler");
/**
 * Handles all the required ACP headers as defined at
 * https://solid.github.io/authorization-panel/acp-specification/#conforming-acp-server
 */
class AcpHeaderHandler extends HttpHandler_1.HttpHandler {
    targetExtractor;
    strategy;
    modes;
    attributes;
    constructor(targetExtractor, strategy, modes, attributes) {
        super();
        this.targetExtractor = targetExtractor;
        this.strategy = strategy;
        this.modes = modes;
        this.attributes = attributes;
    }
    async handle({ request, response }) {
        const identifier = await this.targetExtractor.handleSafe({ request });
        if (!this.strategy.isAuxiliaryIdentifier(identifier)) {
            return;
        }
        const linkValues = [
            `<${Vocabularies_1.ACP.AccessControlResource}>; rel="type"`,
            ...this.modes.map((mode) => `<${mode}>; rel="${Vocabularies_1.ACP.grant}"`),
            ...this.attributes.map((attribute) => `<${attribute}>; rel="${Vocabularies_1.ACP.attribute}"`),
        ];
        (0, HeaderUtil_1.addHeader)(response, 'Link', linkValues);
    }
}
exports.AcpHeaderHandler = AcpHeaderHandler;
//# sourceMappingURL=AcpHeaderHandler.js.map