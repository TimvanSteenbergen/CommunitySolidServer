import type { HttpRequest } from '../../server/HttpRequest';
import type { Operation } from '../Operation';
import type { BodyParser } from './body/BodyParser';
import type { ConditionsParser } from './conditions/ConditionsParser';
import type { TargetExtractor } from './identifier/TargetExtractor';
import type { MetadataParser } from './metadata/MetadataParser';
import type { PreferenceParser } from './preferences/PreferenceParser';
import { RequestParser } from './RequestParser';
/**
 * Input parsers required for a {@link BasicRequestParser}.
 */
export interface BasicRequestParserArgs {
    targetExtractor: TargetExtractor;
    preferenceParser: PreferenceParser;
    metadataParser: MetadataParser;
    conditionsParser: ConditionsParser;
    bodyParser: BodyParser;
}
/**
 * Creates an {@link Operation} from an incoming {@link HttpRequest} by aggregating the results
 * of a {@link TargetExtractor}, {@link MetadataParser},
 * {@link ConditionsParser} and {@link BodyParser}.
 */
export declare class BasicRequestParser extends RequestParser {
    private readonly targetExtractor;
    private readonly preferenceParser;
    private readonly metadataParser;
    private readonly conditionsParser;
    private readonly bodyParser;
    constructor(args: BasicRequestParserArgs);
    handle(request: HttpRequest): Promise<Operation>;
}
