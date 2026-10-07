"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateNotificationGenerator = void 0;
const Vocabularies_1 = require("../../../util/Vocabularies");
const NotificationGenerator_1 = require("./NotificationGenerator");
/**
 * Determines the most relevant activity for a {@link Notification} in case none was provided.
 * This is relevant for the `state` feature where a notification channel needs to know the current state of a resource.
 */
class StateNotificationGenerator extends NotificationGenerator_1.NotificationGenerator {
    source;
    resourceSet;
    constructor(source, resourceSet) {
        super();
        this.source = source;
        this.resourceSet = resourceSet;
    }
    async handle(input) {
        if (input.activity) {
            return this.source.handleSafe(input);
        }
        const activity = await this.resourceSet.hasResource(input.topic) ? Vocabularies_1.AS.terms.Update : Vocabularies_1.AS.terms.Delete;
        return this.source.handleSafe({ ...input, activity });
    }
}
exports.StateNotificationGenerator = StateNotificationGenerator;
//# sourceMappingURL=StateNotificationGenerator.js.map