"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityNotificationGenerator = void 0;
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const Vocabularies_1 = require("../../../util/Vocabularies");
const Notification_1 = require("../Notification");
const NotificationGenerator_1 = require("./NotificationGenerator");
/**
 * A {@link NotificationGenerator} that creates a {@link Notification} by using the provided activity as type.
 * Requests metadata of the topic from the {@link ResourceStore} to fill in the details.
 */
class ActivityNotificationGenerator extends NotificationGenerator_1.NotificationGenerator {
    store;
    eTagHandler;
    constructor(store, eTagHandler) {
        super();
        this.store = store;
        this.eTagHandler = eTagHandler;
    }
    async canHandle({ activity }) {
        if (!activity) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Only defined activities are supported.`);
        }
    }
    async handle({ topic, activity }) {
        const representation = await this.store.getRepresentation(topic, {});
        representation.data.destroy();
        const state = this.eTagHandler.getETag(representation.metadata);
        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@context': [
                Notification_1.CONTEXT_ACTIVITYSTREAMS,
                Notification_1.CONTEXT_NOTIFICATION,
            ],
            id: `urn:${Date.now()}:${topic.path}`,
            type: activity.value.slice(Vocabularies_1.AS.namespace.length),
            object: topic.path,
            state,
            published: new Date().toISOString(),
        };
    }
}
exports.ActivityNotificationGenerator = ActivityNotificationGenerator;
//# sourceMappingURL=ActivityNotificationGenerator.js.map