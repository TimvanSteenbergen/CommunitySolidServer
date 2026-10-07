import type { EmptyObject } from '../../../util/map/MapUtil';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { PasswordIdRoute } from './util/PasswordIdRoute';
import type { PasswordStore } from './util/PasswordStore';
/**
 * Handles the deletion of a password login method.
 */
export declare class DeletePasswordHandler extends JsonInteractionHandler<EmptyObject> {
    private readonly passwordStore;
    private readonly passwordRoute;
    constructor(passwordStore: PasswordStore, passwordRoute: PasswordIdRoute);
    handle({ target, accountId }: JsonInteractionHandlerInput): Promise<JsonRepresentation<EmptyObject>>;
}
