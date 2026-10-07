import type { Representation } from '../../http/representation/Representation';
import type { RepresentationConverter } from '../../storage/conversion/RepresentationConverter';
import type { InteractionHandlerInput } from './InteractionHandler';
import { InteractionHandler } from './InteractionHandler';
import type { JsonInteractionHandler } from './JsonInteractionHandler';
/**
 * An {@link InteractionHandler} that sits in-between
 * an {@link InteractionHandler} and a {@link JsonInteractionHandler}.
 * It converts the input data stream into a JSON object to be used by the stored handler.
 *
 * Since the JSON body is only made during the `handle` call, it can not be used during the `canHandle`,
 * so the `canHandle` call of the stored handler is not called,
 * meaning this class accepts all input that can be converted to JSON.
 */
export declare class JsonConversionHandler extends InteractionHandler {
    private readonly source;
    private readonly converter;
    constructor(source: JsonInteractionHandler, converter: RepresentationConverter);
    canHandle({ operation }: InteractionHandlerInput): Promise<void>;
    handle({ operation, oidcInteraction, accountId }: InteractionHandlerInput): Promise<Representation>;
}
