"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRemoveNotificationGenerator = void 0;
const InternalServerError_1 = require("../../../util/errors/InternalServerError");
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const Vocabularies_1 = require("../../../util/Vocabularies");
const Notification_1 = require("../Notification");
const NotificationGenerator_1 = require("./NotificationGenerator");
/**
 * A {@link NotificationGenerator} specifically for Add/Remove notifications.
 * Creates the notification so the `target` is set to input topic,
 * and the `object` value is extracted from the provided metadata.
 */
class AddRemoveNotificationGenerator extends NotificationGenerator_1.NotificationGenerator {
    store;
    eTagHandler;
    constructor(store, eTagHandler) {
        super();
        this.store = store;
        this.eTagHandler = eTagHandler;
    }
    async canHandle({ activity }) {
        if (!activity || (!activity.equals(Vocabularies_1.AS.terms.Add) && !activity.equals(Vocabularies_1.AS.terms.Remove))) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Only Add/Remove activity updates are supported.`);
        }
    }
    async handle({ activity, topic, metadata }) {
        const representation = await this.store.getRepresentation(topic, {});
        representation.data.destroy();
        const state = this.eTagHandler.getETag(representation.metadata);
        const objects = metadata?.getAll(Vocabularies_1.AS.terms.object);
        if (!objects || objects.length === 0) {
            throw new InternalServerError_1.InternalServerError(`Missing as:object metadata for ${activity?.value} activity on ${topic.path}`);
        }
        if (objects.length > 1) {
            throw new InternalServerError_1.InternalServerError(`Found more than one as:object for ${activity?.value} activity on ${topic.path}`);
        }
        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@context': [
                Notification_1.CONTEXT_ACTIVITYSTREAMS,
                Notification_1.CONTEXT_NOTIFICATION,
            ],
            id: `urn:${Date.now()}:${topic.path}`,
            type: activity.value.slice(Vocabularies_1.AS.namespace.length),
            object: objects[0].value,
            target: topic.path,
            state,
            published: new Date().toISOString(),
        };
    }
}
exports.AddRemoveNotificationGenerator = AddRemoveNotificationGenerator;
//# sourceMappingURL=AddRemoveNotificationGenerator.js.map