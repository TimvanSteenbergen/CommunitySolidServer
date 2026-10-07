import { IdInteractionRoute } from '../routing/IdInteractionRoute';
import type { InteractionRoute } from '../routing/InteractionRoute';
export type AccountIdKey = 'accountId';
export declare const ACCOUNT_ID_KEY: AccountIdKey;
/**
 * A route that includes an account identifier.
 */
export type AccountIdRoute = InteractionRoute<AccountIdKey>;
/**
 * Implementation of an {@link AccountIdRoute} that adds the identifier relative to a base {@link InteractionRoute}.
 */
export declare class BaseAccountIdRoute extends IdInteractionRoute<never, AccountIdKey> implements AccountIdRoute {
    constructor(base: InteractionRoute);
}
