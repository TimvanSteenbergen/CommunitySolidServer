"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkRelObject = exports.LinkRelParser = void 0;
const n3_1 = require("n3");
const LogUtil_1 = require("../../../logging/LogUtil");
const HeaderUtil_1 = require("../../../util/HeaderUtil");
const Vocabularies_1 = require("../../../util/Vocabularies");
const MetadataParser_1 = require("./MetadataParser");
var namedNode = n3_1.DataFactory.namedNode;
/**
 * Parses Link headers with a specific `rel` value and adds them as metadata with the given predicate.
 */
class LinkRelParser extends MetadataParser_1.MetadataParser {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    linkRelMap;
    constructor(linkRelMap) {
        super();
        this.linkRelMap = linkRelMap;
    }
    async handle(input) {
        for (const { target, parameters } of (0, HeaderUtil_1.parseLinkHeader)(input.request.headers.link)) {
            this.linkRelMap[parameters.rel]?.addToMetadata(target, input.metadata, this.logger);
        }
    }
}
exports.LinkRelParser = LinkRelParser;
/**
 * Represents the values that are parsed as metadata
 */
class LinkRelObject {
    value;
    ephemeral;
    allowList;
    /**
     * @param value - The value corresponding to the `rel` value that will be used as predicate in the metadata.
     * @param ephemeral - (Optional) Indicates whether it will be stored by the server.
     * @param allowList - (Optional) Contains the objects that are allowed to be used with the given predicate.
     */
    constructor(value, ephemeral, allowList) {
        this.value = namedNode(value);
        this.ephemeral = ephemeral ?? false;
        this.allowList = allowList;
    }
    /**
     * Checks whether the object can be added to the metadata
     *
     * @param object - The link target.
     *
     * @returns a boolean to indicate whether it can be added to the metadata or not
     */
    objectAllowed(object) {
        return this.allowList?.includes(object) ?? true;
    }
    /**
     * Adds the object to the metadata when it is allowed
     *
     * @param object - The link target.
     * @param metadata - Metadata of the resource.
     * @param logger - Logger
     */
    addToMetadata(object, metadata, logger) {
        if (this.objectAllowed(object)) {
            if (this.ephemeral) {
                metadata.add(this.value, namedNode(object), Vocabularies_1.SOLID_META.terms.ResponseMetadata);
                logger.debug(`"<${metadata.identifier.value}> <${this.value.value}> <${object}>." ` +
                    `will not be stored permanently in the metadata.`);
            }
            else {
                metadata.add(this.value, namedNode(object));
            }
        }
        else {
            logger.debug(`"<${metadata.identifier.value}> <${this.value.value}> <${object}>." will not be added to the metadata`);
        }
    }
}
exports.LinkRelObject = LinkRelObject;
//# sourceMappingURL=LinkRelParser.js.map