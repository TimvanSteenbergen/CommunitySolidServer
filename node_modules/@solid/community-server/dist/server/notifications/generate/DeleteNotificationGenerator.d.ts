import type { Notification } from '../Notification';
import type { NotificationHandlerInput } from '../NotificationHandler';
import { NotificationGenerator } from './NotificationGenerator';
/**
 * Generates a {@link Notification} for a resource that was deleted.
 * This differs from other activity notifications in that there is no state and no resource metadata
 * since the resource no longer exists.
 */
export declare class DeleteNotificationGenerator extends NotificationGenerator {
    canHandle({ activity }: NotificationHandlerInput): Promise<void>;
    handle({ topic }: NotificationHandlerInput): Promise<Notification>;
}
