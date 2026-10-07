"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicConditionsParser = void 0;
const LogUtil_1 = require("../../../logging/LogUtil");
const BasicConditions_1 = require("../../../storage/conditions/BasicConditions");
const StringUtil_1 = require("../../../util/StringUtil");
const ConditionsParser_1 = require("./ConditionsParser");
/**
 * Creates a Conditions object based on the following headers:
 *  - If-Modified-Since
 *  - If-Unmodified-Since
 *  - If-Match
 *  - If-None-Match
 *
 * Implementation based on RFC7232
 */
class BasicConditionsParser extends ConditionsParser_1.ConditionsParser {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    eTagHandler;
    constructor(eTagHandler) {
        super();
        this.eTagHandler = eTagHandler;
    }
    async handle(request) {
        const options = {
            matchesETag: this.parseTagHeader(request, 'if-match'),
            notMatchesETag: this.parseTagHeader(request, 'if-none-match'),
        };
        // A recipient MUST ignore If-Modified-Since if the request contains an If-None-Match header field
        // A recipient MUST ignore the If-Modified-Since header field ... if the request method is neither GET nor HEAD.
        if (!options.notMatchesETag && (request.method === 'GET' || request.method === 'HEAD')) {
            options.modifiedSince = this.parseDateHeader(request, 'if-modified-since');
        }
        // A recipient MUST ignore If-Unmodified-Since if the request contains an If-Match header field
        if (!options.matchesETag) {
            options.unmodifiedSince = this.parseDateHeader(request, 'if-unmodified-since');
        }
        // Only return a Conditions object if there is at least one condition; undefined otherwise
        this.logger.debug(`Found the following conditions: ${JSON.stringify(options)}`);
        if (Object.values(options).some((val) => typeof val !== 'undefined')) {
            return new BasicConditions_1.BasicConditions(this.eTagHandler, options);
        }
    }
    /**
     * Converts a request header containing a datetime string to an actual Date object.
     * Undefined if there is no value for the given header name.
     */
    parseDateHeader(request, header) {
        const headerVal = request.headers[header];
        if (headerVal) {
            const timestamp = Date.parse(headerVal);
            return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
        }
    }
    /**
     * Converts a request header containing ETags to an array of ETags.
     * Undefined if there is no value for the given header name.
     */
    parseTagHeader(request, header) {
        const headerValue = request.headers[header];
        if (headerValue) {
            return (0, StringUtil_1.splitCommaSeparated)(headerValue.trim());
        }
    }
}
exports.BasicConditionsParser = BasicConditionsParser;
//# sourceMappingURL=BasicConditionsParser.js.map