"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferenceSupport = void 0;
/**
 * Helper class that checks if the stored {@link RepresentationConverter} and {@link RepresentationPreferences}
 * support the given input {@link RepresentationPreferences} and {@link Representation}.
 *
 * Creates a new object by combining the input arguments together with the stored preferences and checks
 * if the converter can handle that object.
 */
class PreferenceSupport {
    preferences;
    converter;
    constructor(preferences, converter) {
        this.preferences = preferences;
        this.converter = converter;
    }
    async supports(input) {
        const newInput = { ...input, preferences: this.preferences };
        try {
            await this.converter.canHandle(newInput);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.PreferenceSupport = PreferenceSupport;
//# sourceMappingURL=PreferenceSupport.js.map