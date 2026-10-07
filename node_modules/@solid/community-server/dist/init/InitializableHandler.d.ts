import type { Initializable } from './Initializable';
import { Initializer } from './Initializer';
/**
 * Allows using an Initializable as an Initializer Handler.
 */
export declare class InitializableHandler extends Initializer {
    protected readonly initializable: Initializable;
    constructor(initializable: Initializable);
    handle(): Promise<void>;
}
