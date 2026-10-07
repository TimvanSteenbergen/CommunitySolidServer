"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteNotificationGenerator = void 0;
const NotImplementedHttpError_1 = require("../../../util/errors/NotImplementedHttpError");
const Vocabularies_1 = require("../../../util/Vocabularies");
const Notification_1 = require("../Notification");
const NotificationGenerator_1 = require("./NotificationGenerator");
/**
 * Generates a {@link Notification} for a resource that was deleted.
 * This differs from other activity notifications in that there is no state and no resource metadata
 * since the resource no longer exists.
 */
class DeleteNotificationGenerator extends NotificationGenerator_1.NotificationGenerator {
    async canHandle({ activity }) {
        if (!activity?.equals(Vocabularies_1.AS.terms.Delete)) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Only Delete activity updates are supported.`);
        }
    }
    async handle({ topic }) {
        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@context': [
                Notification_1.CONTEXT_ACTIVITYSTREAMS,
                Notification_1.CONTEXT_NOTIFICATION,
            ],
            id: `urn:${Date.now()}:${topic.path}`,
            type: 'Delete',
            object: topic.path,
            published: new Date().toISOString(),
        };
    }
}
exports.DeleteNotificationGenerator = DeleteNotificationGenerator;
//# sourceMappingURL=DeleteNotificationGenerator.js.map