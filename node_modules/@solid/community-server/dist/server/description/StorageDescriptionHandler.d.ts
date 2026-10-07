import type { ResponseDescription } from '../../http/output/response/ResponseDescription';
import type { ResourceIdentifier } from '../../http/representation/ResourceIdentifier';
import type { ResourceStore } from '../../storage/ResourceStore';
import type { OperationHttpHandlerInput } from '../OperationHttpHandler';
import { OperationHttpHandler } from '../OperationHttpHandler';
import type { StorageDescriber } from './StorageDescriber';
/**
 * Generates the response for GET requests targeting a storage description resource.
 * The input path needs to match the relative path used to generate storage description resources
 * and will be used to verify if the container it is linked to is an actual storage.
 */
export declare class StorageDescriptionHandler extends OperationHttpHandler {
    private readonly store;
    private readonly path;
    private readonly describer;
    constructor(store: ResourceStore, path: string, describer: StorageDescriber);
    canHandle({ operation: { target, method } }: OperationHttpHandlerInput): Promise<void>;
    handle({ operation: { target } }: OperationHttpHandlerInput): Promise<ResponseDescription>;
    /**
     * Determine the identifier of the root storage based on the identifier of the root storage description resource.
     */
    protected getStorageIdentifier(descriptionIdentifier: ResourceIdentifier): ResourceIdentifier;
}
