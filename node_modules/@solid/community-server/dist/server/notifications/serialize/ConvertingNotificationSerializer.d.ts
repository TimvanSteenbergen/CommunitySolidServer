import type { Representation } from '../../../http/representation/Representation';
import type { RepresentationConverter } from '../../../storage/conversion/RepresentationConverter';
import type { NotificationSerializerInput } from './NotificationSerializer';
import { NotificationSerializer } from './NotificationSerializer';
/**
 * Converts a serialization based on the provided `accept` feature value.
 * In case none was provided no conversion takes place.
 */
export declare class ConvertingNotificationSerializer extends NotificationSerializer {
    private readonly source;
    private readonly converter;
    constructor(source: NotificationSerializer, converter: RepresentationConverter);
    canHandle(input: NotificationSerializerInput): Promise<void>;
    handle(input: NotificationSerializerInput): Promise<Representation>;
}
