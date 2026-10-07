import type { Finalizable } from './Finalizable';
import { Finalizer } from './Finalizer';
/**
 * Allows using a Finalizable as a Finalizer Handler.
 */
export declare class FinalizableHandler extends Finalizer {
    protected readonly finalizable: Finalizable;
    constructor(finalizable: Finalizable);
    handle(): Promise<void>;
}
