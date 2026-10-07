import type { NotificationHandlerInput } from './NotificationHandler';
import { NotificationHandler } from './NotificationHandler';
/**
 * A {@link NotificationHandler} that only accepts input for a specific notification channel type.
 */
export declare class TypedNotificationHandler extends NotificationHandler {
    private readonly type;
    private readonly source;
    constructor(type: string, source: NotificationHandler);
    canHandle(input: NotificationHandlerInput): Promise<void>;
    handle(input: NotificationHandlerInput): Promise<void>;
}
