import type { ETagHandler } from '../../storage/conditions/ETagHandler';
import type { NotificationGenerator } from './generate/NotificationGenerator';
import type { NotificationEmitter } from './NotificationEmitter';
import type { NotificationHandlerInput } from './NotificationHandler';
import { NotificationHandler } from './NotificationHandler';
import type { NotificationSerializer } from './serialize/NotificationSerializer';
export interface ComposedNotificationHandlerArgs {
    generator: NotificationGenerator;
    serializer: NotificationSerializer;
    emitter: NotificationEmitter;
    eTagHandler: ETagHandler;
}
/**
 * Generates, serializes and emits a {@link Notification} using a {@link NotificationGenerator},
 * {@link NotificationSerializer} and {@link NotificationEmitter}.
 *
 * Will not emit an event when it has the same state as the notification channel.
 */
export declare class ComposedNotificationHandler extends NotificationHandler {
    private readonly generator;
    private readonly serializer;
    private readonly emitter;
    private readonly eTagHandler;
    constructor(args: ComposedNotificationHandlerArgs);
    canHandle(input: NotificationHandlerInput): Promise<void>;
    handle(input: NotificationHandlerInput): Promise<void>;
}
