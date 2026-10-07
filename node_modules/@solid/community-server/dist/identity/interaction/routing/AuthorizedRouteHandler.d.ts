import type { AccountIdRoute } from '../account/AccountIdRoute';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandler, JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { InteractionRouteHandler } from './InteractionRouteHandler';
/**
 * An {@link InteractionRouteHandler} specifically for an {@link AccountIdRoute}.
 * If there is no account ID, implying the user is not logged in,
 * an {@link UnauthorizedHttpError} will be thrown.
 * If there is an account ID, but it does not match the one in target resource,
 * a {@link ForbiddenHttpError} will be thrown.
 */
export declare class AuthorizedRouteHandler extends InteractionRouteHandler<AccountIdRoute> {
    private readonly logger;
    constructor(route: AccountIdRoute, source: JsonInteractionHandler);
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation>;
}
