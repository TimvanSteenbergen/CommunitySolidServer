import type { Quad } from '@rdfjs/types';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { RepresentationConverter } from '../../storage/conversion/RepresentationConverter';
import { StorageDescriber } from '../description/StorageDescriber';
import type { NotificationChannelType } from './NotificationChannelType';
/**
 * Outputs quads describing all the subscription services of the server,
 * as described in https://solidproject.org/TR/2022/notifications-protocol-20221231#discovery and
 * https://solidproject.org/TR/2022/notifications-protocol-20221231#description-resource-data-model.
 *
 * In the future, if there is ever a need to add notification channels to the description resource as described above,
 * this functionality should probably be added here as well.
 */
export declare class NotificationDescriber extends StorageDescriber {
    private readonly converter;
    private readonly subscriptions;
    constructor(converter: RepresentationConverter, subscriptions: NotificationChannelType[]);
    handle(identifier: ResourceIdentifier): Promise<Quad[]>;
}
