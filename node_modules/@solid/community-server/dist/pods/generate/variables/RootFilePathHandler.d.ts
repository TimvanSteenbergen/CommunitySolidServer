import type { ResourceIdentifier } from '../../../http/representation/ResourceIdentifier';
import type { FileIdentifierMapper } from '../../../storage/mapping/FileIdentifierMapper';
import type { PodSettings } from '../../settings/PodSettings';
import { VariableHandler } from './VariableHandler';
/**
 * Uses a FileIdentifierMapper to generate a root file path variable based on the identifier.
 * Will throw an error if the resulting file path already exists.
 */
export declare class RootFilePathHandler extends VariableHandler {
    private readonly fileMapper;
    constructor(fileMapper: FileIdentifierMapper);
    handle({ identifier, settings }: {
        identifier: ResourceIdentifier;
        settings: PodSettings;
    }): Promise<void>;
}
