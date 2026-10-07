import type { ETagHandler } from '../../../storage/conditions/ETagHandler';
import type { ResourceStore } from '../../../storage/ResourceStore';
import type { Notification } from '../Notification';
import type { NotificationHandlerInput } from '../NotificationHandler';
import { NotificationGenerator } from './NotificationGenerator';
/**
 * A {@link NotificationGenerator} that creates a {@link Notification} by using the provided activity as type.
 * Requests metadata of the topic from the {@link ResourceStore} to fill in the details.
 */
export declare class ActivityNotificationGenerator extends NotificationGenerator {
    private readonly store;
    private readonly eTagHandler;
    constructor(store: ResourceStore, eTagHandler: ETagHandler);
    canHandle({ activity }: NotificationHandlerInput): Promise<void>;
    handle({ topic, activity }: NotificationHandlerInput): Promise<Notification>;
}
