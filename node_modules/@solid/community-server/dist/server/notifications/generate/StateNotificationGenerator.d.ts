import type { ResourceSet } from '../../../storage/ResourceSet';
import type { Notification } from '../Notification';
import type { NotificationHandlerInput } from '../NotificationHandler';
import { NotificationGenerator } from './NotificationGenerator';
/**
 * Determines the most relevant activity for a {@link Notification} in case none was provided.
 * This is relevant for the `state` feature where a notification channel needs to know the current state of a resource.
 */
export declare class StateNotificationGenerator extends NotificationGenerator {
    private readonly source;
    private readonly resourceSet;
    constructor(source: NotificationGenerator, resourceSet: ResourceSet);
    handle(input: NotificationHandlerInput): Promise<Notification>;
}
