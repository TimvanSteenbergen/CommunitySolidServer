"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassthroughConverter = void 0;
const RepresentationConverter_1 = require("./RepresentationConverter");
/**
 * A {@link RepresentationConverter} that does not perform any conversion.
 */
class PassthroughConverter extends RepresentationConverter_1.RepresentationConverter {
    async handle({ representation }) {
        return representation;
    }
}
exports.PassthroughConverter = PassthroughConverter;
//# sourceMappingURL=PassthroughConverter.js.map