import type { Representation } from '../../representation/Representation';
import type { BodyParserArgs } from './BodyParser';
import { BodyParser } from './BodyParser';
/**
 * Converts incoming {@link HttpRequest} to a Representation without any further parsing.
 */
export declare class RawBodyParser extends BodyParser {
    protected readonly logger: import("../../..").Logger;
    handle({ request, metadata }: BodyParserArgs): Promise<Representation>;
}
