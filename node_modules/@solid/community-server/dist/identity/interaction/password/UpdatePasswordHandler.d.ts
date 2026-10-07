import type { EmptyObject } from '../../../util/map/MapUtil';
import type { JsonRepresentation } from '../InteractionUtil';
import type { JsonInteractionHandlerInput } from '../JsonInteractionHandler';
import { JsonInteractionHandler } from '../JsonInteractionHandler';
import type { JsonView } from '../JsonView';
import type { PasswordIdRoute } from './util/PasswordIdRoute';
import type { PasswordStore } from './util/PasswordStore';
/**
 * Allows the password of a login to be updated.
 */
export declare class UpdatePasswordHandler extends JsonInteractionHandler<EmptyObject> implements JsonView {
    private readonly logger;
    private readonly passwordStore;
    private readonly passwordRoute;
    constructor(passwordStore: PasswordStore, passwordRoute: PasswordIdRoute);
    getView(): Promise<JsonRepresentation>;
    handle(input: JsonInteractionHandlerInput): Promise<JsonRepresentation<EmptyObject>>;
}
