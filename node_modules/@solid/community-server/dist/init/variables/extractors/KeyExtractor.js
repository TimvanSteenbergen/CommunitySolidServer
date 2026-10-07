"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyExtractor = void 0;
const ShorthandExtractor_1 = require("./ShorthandExtractor");
/**
 * A simple {@link ShorthandExtractor} that extracts a single value from the input map.
 * Returns the default value if it was defined in case no value was found in the map.
 */
class KeyExtractor extends ShorthandExtractor_1.ShorthandExtractor {
    key;
    defaultValue;
    constructor(key, defaultValue) {
        super();
        this.key = key;
        this.defaultValue = defaultValue;
    }
    async handle(args) {
        return typeof args[this.key] === 'undefined' ? this.defaultValue : args[this.key];
    }
}
exports.KeyExtractor = KeyExtractor;
//# sourceMappingURL=KeyExtractor.js.map