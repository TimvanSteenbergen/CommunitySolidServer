"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringStore = void 0;
const ActivityEmitter_1 = require("../server/notifications/ActivityEmitter");
const Vocabularies_1 = require("../util/Vocabularies");
// The ActivityStream terms for which we emit an event
const knownActivities = [Vocabularies_1.AS.terms.Add, Vocabularies_1.AS.terms.Create, Vocabularies_1.AS.terms.Delete, Vocabularies_1.AS.terms.Remove, Vocabularies_1.AS.terms.Update];
/**
 * Store that notifies listeners of changes to its source
 * by emitting a `changed` event.
 */
class MonitoringStore extends ActivityEmitter_1.BaseActivityEmitter {
    source;
    constructor(source) {
        super();
        this.source = source;
    }
    async hasResource(identifier) {
        return this.source.hasResource(identifier);
    }
    async getRepresentation(identifier, preferences, conditions) {
        return this.source.getRepresentation(identifier, preferences, conditions);
    }
    async addResource(container, representation, conditions) {
        return this.emitChanged(await this.source.addResource(container, representation, conditions));
    }
    async deleteResource(identifier, conditions) {
        return this.emitChanged(await this.source.deleteResource(identifier, conditions));
    }
    async setRepresentation(identifier, representation, conditions) {
        return this.emitChanged(await this.source.setRepresentation(identifier, representation, conditions));
    }
    async modifyResource(identifier, patch, conditions) {
        return this.emitChanged(await this.source.modifyResource(identifier, patch, conditions));
    }
    emitChanged(changes) {
        for (const [identifier, metadata] of changes) {
            const activity = metadata.get(Vocabularies_1.SOLID_AS.terms.activity);
            if (this.isKnownActivity(activity)) {
                this.emit('changed', identifier, activity, metadata);
                this.emit(activity.value, identifier, metadata);
            }
        }
        return changes;
    }
    isKnownActivity(term) {
        return Boolean(term && knownActivities.some((entry) => entry.equals(term)));
    }
}
exports.MonitoringStore = MonitoringStore;
//# sourceMappingURL=MonitoringStore.js.map