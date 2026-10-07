"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicRequestParser = void 0;
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const RepresentationMetadata_1 = require("../representation/RepresentationMetadata");
const RequestParser_1 = require("./RequestParser");
/**
 * Creates an {@link Operation} from an incoming {@link HttpRequest} by aggregating the results
 * of a {@link TargetExtractor}, {@link MetadataParser},
 * {@link ConditionsParser} and {@link BodyParser}.
 */
class BasicRequestParser extends RequestParser_1.RequestParser {
    targetExtractor;
    preferenceParser;
    metadataParser;
    conditionsParser;
    bodyParser;
    constructor(args) {
        super();
        this.targetExtractor = args.targetExtractor;
        this.preferenceParser = args.preferenceParser;
        this.metadataParser = args.metadataParser;
        this.conditionsParser = args.conditionsParser;
        this.bodyParser = args.bodyParser;
    }
    async handle(request) {
        const { method } = request;
        if (!method) {
            throw new InternalServerError_1.InternalServerError('No method specified on the HTTP request');
        }
        const target = await this.targetExtractor.handleSafe({ request });
        const preferences = await this.preferenceParser.handleSafe({ request });
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(target);
        await this.metadataParser.handleSafe({ request, metadata });
        const conditions = await this.conditionsParser.handleSafe(request);
        const body = await this.bodyParser.handleSafe({ request, metadata });
        return { method, target, preferences, conditions, body };
    }
}
exports.BasicRequestParser = BasicRequestParser;
//# sourceMappingURL=BasicRequestParser.js.map