import type { EmptyObject } from '../../../util/map/MapUtil';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonView } from '../JsonView';
import type { LoginOutputType } from '../login/ResolveLoginHandler';
import { ResolveLoginHandler } from '../login/ResolveLoginHandler';
import type { AccountStore } from './util/AccountStore';
import type { CookieStore } from './util/CookieStore';
/**
 * Creates new accounts using an {@link AccountStore};
 */
export declare class CreateAccountHandler extends ResolveLoginHandler implements JsonView {
    constructor(accountStore: AccountStore, cookieStore: CookieStore);
    getView(): Promise<JsonRepresentation<EmptyObject>>;
    login(): Promise<JsonRepresentation<LoginOutputType>>;
}
