import type { Representation } from '../../http/representation/Representation';
import type { ReadWriteLocker } from '../../util/locking/ReadWriteLocker';
import type { AccountIdRoute } from './account/AccountIdRoute';
import type { InteractionHandlerInput } from './InteractionHandler';
import { InteractionHandler } from './InteractionHandler';
/**
 * An {@link InteractionHandler} that locks the path generated with the stored route during an operation.
 * If the route is the base account route, this can be used to prevent multiple operations on the same account.
 */
export declare class LockingInteractionHandler extends InteractionHandler {
    private readonly locker;
    private readonly accountRoute;
    private readonly source;
    constructor(locker: ReadWriteLocker, accountRoute: AccountIdRoute, source: InteractionHandler);
    canHandle(input: InteractionHandlerInput): Promise<void>;
    handle(input: InteractionHandlerInput): Promise<Representation>;
}
