import type { Representation } from '../../../http/representation/Representation';
import type { NotificationSerializerInput } from './NotificationSerializer';
import { NotificationSerializer } from './NotificationSerializer';
/**
 * Serializes a Notification into a JSON-LD string.
 */
export declare class JsonLdNotificationSerializer extends NotificationSerializer {
    handle({ notification }: NotificationSerializerInput): Promise<Representation>;
}
