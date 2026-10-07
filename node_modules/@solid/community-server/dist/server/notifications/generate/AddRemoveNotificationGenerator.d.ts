import type { ETagHandler } from '../../../storage/conditions/ETagHandler';
import type { ResourceStore } from '../../../storage/ResourceStore';
import type { Notification } from '../Notification';
import type { NotificationHandlerInput } from '../NotificationHandler';
import { NotificationGenerator } from './NotificationGenerator';
/**
 * A {@link NotificationGenerator} specifically for Add/Remove notifications.
 * Creates the notification so the `target` is set to input topic,
 * and the `object` value is extracted from the provided metadata.
 */
export declare class AddRemoveNotificationGenerator extends NotificationGenerator {
    private readonly store;
    private readonly eTagHandler;
    constructor(store: ResourceStore, eTagHandler: ETagHandler);
    canHandle({ activity }: NotificationHandlerInput): Promise<void>;
    handle({ activity, topic, metadata }: NotificationHandlerInput): Promise<Notification>;
}
