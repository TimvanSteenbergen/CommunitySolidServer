import type { ResourceIdentifier } from '../../../http/representation/ResourceIdentifier';
import type { NotificationChannel } from '../NotificationChannel';
/**
 * Default StreamingHTTPChanel2023 for a topic.
 * Currently channel description is only used internally and never sent to the client.
 * The default channel uses Turtle.
 */
export declare function generateChannel(topic: ResourceIdentifier): NotificationChannel;
