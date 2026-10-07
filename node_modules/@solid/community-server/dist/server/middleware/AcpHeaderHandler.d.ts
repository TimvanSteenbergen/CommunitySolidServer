import type { AuxiliaryIdentifierStrategy } from '../../http/auxiliary/AuxiliaryIdentifierStrategy';
import type { TargetExtractor } from '../../http/input/identifier/TargetExtractor';
import type { HttpHandlerInput } from '../HttpHandler';
import { HttpHandler } from '../HttpHandler';
/**
 * Handles all the required ACP headers as defined at
 * https://solid.github.io/authorization-panel/acp-specification/#conforming-acp-server
 */
export declare class AcpHeaderHandler extends HttpHandler {
    private readonly targetExtractor;
    private readonly strategy;
    private readonly modes;
    private readonly attributes;
    constructor(targetExtractor: TargetExtractor, strategy: AuxiliaryIdentifierStrategy, modes: string[], attributes: string[]);
    handle({ request, response }: HttpHandlerInput): Promise<void>;
}
