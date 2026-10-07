"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparqlDataAccessor = void 0;
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const fetch_sparql_endpoint_1 = require("fetch-sparql-endpoint");
const n3_1 = require("n3");
const sparqljs_1 = require("sparqljs");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const ConflictHttpError_1 = require("../../util/errors/ConflictHttpError");
const ErrorUtil_1 = require("../../util/errors/ErrorUtil");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const UnsupportedMediaTypeHttpError_1 = require("../../util/errors/UnsupportedMediaTypeHttpError");
const GuardedStream_1 = require("../../util/GuardedStream");
const PathUtil_1 = require("../../util/PathUtil");
const Vocabularies_1 = require("../../util/Vocabularies");
const { defaultGraph, namedNode, quad, variable } = n3_1.DataFactory;
/**
 * Stores all data and metadata of resources in a SPARQL backend.
 * Communication is done by sending SPARQL queries.
 * Queries are constructed in such a way to keep everything consistent,
 * such as updating containment triples and deleting old data when it is overwritten.
 *
 * Since metadata is hidden, no containment triples are stored for metadata files.
 *
 * All input container metadata is stored in its metadata identifier.
 * The containment triples are stored in the graph corresponding to the actual identifier
 * so those don't get overwritten.
 */
class SparqlDataAccessor {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    endpoint;
    identifierStrategy;
    fetcher;
    generator;
    constructor(endpoint, identifierStrategy) {
        this.endpoint = endpoint;
        this.identifierStrategy = identifierStrategy;
        this.fetcher = new fetch_sparql_endpoint_1.SparqlEndpointFetcher();
        this.generator = new sparqljs_1.Generator();
    }
    /**
     * Only Quad data streams are supported.
     */
    async canHandle(representation) {
        if (representation.binary || representation.metadata.contentType !== ContentTypes_1.INTERNAL_QUADS) {
            throw new UnsupportedMediaTypeHttpError_1.UnsupportedMediaTypeHttpError('Only Quad data is supported.');
        }
    }
    /**
     * Returns all triples stored for the corresponding identifier.
     * Note that this will not throw a 404 if no results were found.
     */
    async getData(identifier) {
        const name = namedNode(identifier.path);
        return this.sendSparqlConstruct(this.sparqlConstruct(name));
    }
    /**
     * Returns the metadata for the corresponding identifier.
     * Will throw 404 if no metadata was found.
     */
    async getMetadata(identifier) {
        const name = namedNode(identifier.path);
        const query = this.sparqlConstruct(this.getMetadataNode(name));
        const stream = await this.sendSparqlConstruct(query);
        const quads = await (0, arrayify_stream_1.default)(stream);
        if (quads.length === 0) {
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(identifier).addQuads(quads);
        if (!(0, PathUtil_1.isContainerIdentifier)(identifier)) {
            metadata.contentType = ContentTypes_1.INTERNAL_QUADS;
        }
        return metadata;
    }
    async *getChildren(identifier) {
        // Only triples that have a container identifier as subject are the containment triples
        const name = namedNode(identifier.path);
        const stream = await this.sendSparqlConstruct(this.sparqlConstruct(name));
        for await (const entry of stream) {
            yield new RepresentationMetadata_1.RepresentationMetadata(entry.object);
        }
    }
    /**
     * Writes the given metadata for the container.
     */
    async writeContainer(identifier, metadata) {
        const { name, parent } = this.getRelatedNames(identifier);
        return this.sendSparqlUpdate(this.sparqlInsert(name, metadata, parent));
    }
    /**
     * Reads the given data stream and stores it together with the metadata.
     */
    async writeDocument(identifier, data, metadata) {
        if (this.isMetadataIdentifier(identifier)) {
            throw new ConflictHttpError_1.ConflictHttpError('Not allowed to create NamedNodes with the metadata extension.');
        }
        const { name, parent } = this.getRelatedNames(identifier);
        const triples = await (0, arrayify_stream_1.default)(data);
        const def = defaultGraph();
        if (triples.some((triple) => !def.equals(triple.graph))) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Only triples in the default graph are supported.');
        }
        // Not relevant since all content is triples
        metadata.removeAll(Vocabularies_1.CONTENT_TYPE_TERM);
        return this.sendSparqlUpdate(this.sparqlInsert(name, metadata, parent, triples));
    }
    /**
     * Reads the metadata and stores it.
     */
    async writeMetadata(identifier, metadata) {
        const { name } = this.getRelatedNames(identifier);
        const metaName = this.getMetadataNode(name);
        return this.sendSparqlUpdate(this.sparqlInsertMetadata(metaName, metadata));
    }
    /**
     * Removes all graph data relevant to the given identifier.
     */
    async deleteResource(identifier) {
        const { name, parent } = this.getRelatedNames(identifier);
        return this.sendSparqlUpdate(this.sparqlDelete(name, parent));
    }
    /**
     * Helper function to get named nodes corresponding to the identifier and its parent container.
     * In case of a root container only the name will be returned.
     */
    getRelatedNames(identifier) {
        const name = namedNode(identifier.path);
        // Root containers don't have a parent
        if (this.identifierStrategy.isRootContainer(identifier)) {
            return { name };
        }
        const parentIdentifier = this.identifierStrategy.getParentContainer(identifier);
        const parent = namedNode(parentIdentifier.path);
        return { name, parent };
    }
    /**
     * Creates the name for the metadata of a resource.
     *
     * @param name - Name of the (non-metadata) resource.
     */
    getMetadataNode(name) {
        return namedNode(`meta:${name.value}`);
    }
    /**
     * Checks if the given identifier corresponds to the names used for metadata identifiers.
     */
    isMetadataIdentifier(identifier) {
        return identifier.path.startsWith('meta:');
    }
    /**
     * Creates a CONSTRUCT query that returns all quads contained within a single resource.
     *
     * @param name - Name of the resource to query.
     */
    sparqlConstruct(name) {
        const pattern = quad(variable('s'), variable('p'), variable('o'));
        return {
            queryType: 'CONSTRUCT',
            template: [pattern],
            where: [this.sparqlSelectGraph(name, [pattern])],
            type: 'query',
            prefixes: {},
        };
    }
    sparqlSelectGraph(name, triples) {
        return {
            type: 'graph',
            name,
            patterns: [{ type: 'bgp', triples }],
        };
    }
    /**
     * Creates an update query that overwrites the data and metadata of a resource.
     * If there are no triples we assume it's a container (so don't overwrite the main graph with containment triples).
     *
     * @param name - Name of the resource to update.
     * @param metadata - New metadata of the resource.
     * @param parent - Name of the parent to update the containment triples.
     * @param triples - New data of the resource.
     */
    sparqlInsert(name, metadata, parent, triples) {
        const metaName = this.getMetadataNode(name);
        // Insert new metadata and containment triple
        const insert = [this.sparqlUpdateGraph(metaName, metadata.quads())];
        if (parent) {
            insert.push(this.sparqlUpdateGraph(parent, [quad(parent, Vocabularies_1.LDP.terms.contains, name)]));
        }
        // Necessary updates: delete metadata and insert new data
        const updates = [
            this.sparqlUpdateDeleteAll(metaName),
            {
                updateType: 'insert',
                insert,
            },
        ];
        // Only overwrite data triples for documents
        if (triples) {
            // This needs to be first so it happens before the insert
            updates.unshift(this.sparqlUpdateDeleteAll(name));
            if (triples.length > 0) {
                insert.push(this.sparqlUpdateGraph(name, triples));
            }
        }
        return {
            updates,
            type: 'update',
            prefixes: {},
        };
    }
    /**
     * Creates an update query that overwrites metadata of a resource.
     *
     * @param metaName - Name of the metadata resource to update.
     * @param metadata - New metadata of the resource.
     */
    sparqlInsertMetadata(metaName, metadata) {
        // Insert new metadata and containment triple
        const insert = [this.sparqlUpdateGraph(metaName, metadata.quads())];
        // Necessary updates: delete metadata and insert new data
        const updates = [
            this.sparqlUpdateDeleteAll(metaName),
            {
                updateType: 'insert',
                insert,
            },
        ];
        return {
            updates,
            type: 'update',
            prefixes: {},
        };
    }
    /**
     * Creates a query that deletes everything related to the given name.
     *
     * @param name - Name of resource to delete.
     * @param parent - Parent of the resource to delete so the containment triple can be removed (unless root).
     */
    sparqlDelete(name, parent) {
        const update = {
            updates: [
                this.sparqlUpdateDeleteAll(name),
                this.sparqlUpdateDeleteAll(this.getMetadataNode(name)),
            ],
            type: 'update',
            prefixes: {},
        };
        if (parent) {
            update.updates.push({
                updateType: 'delete',
                delete: [this.sparqlUpdateGraph(parent, [quad(parent, Vocabularies_1.LDP.terms.contains, name)])],
            });
        }
        return update;
    }
    /**
     * Helper function for creating SPARQL update queries.
     * Creates an operation for deleting all triples in a graph.
     *
     * @param name - Name of the graph to delete.
     */
    sparqlUpdateDeleteAll(name) {
        return {
            updateType: 'deletewhere',
            delete: [this.sparqlUpdateGraph(name, [quad(variable(`s`), variable(`p`), variable(`o`))])],
        };
    }
    /**
     * Helper function for creating SPARQL update queries.
     * Creates a Graph selector with the given triples.
     *
     * @param name - Name of the graph.
     * @param triples - Triples/triple patterns to select.
     */
    sparqlUpdateGraph(name, triples) {
        return { type: 'graph', name, triples };
    }
    /**
     * Sends a SPARQL CONSTRUCT query to the endpoint and returns a stream of quads.
     *
     * @param sparqlQuery - Query to execute.
     */
    async sendSparqlConstruct(sparqlQuery) {
        const query = this.generator.stringify(sparqlQuery);
        this.logger.info(`Sending SPARQL CONSTRUCT query to ${this.endpoint}: ${query}`);
        try {
            return (0, GuardedStream_1.guardStream)(await this.fetcher.fetchTriples(this.endpoint, query));
        }
        catch (error) {
            this.logger.error(`SPARQL endpoint ${this.endpoint} error: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            throw error;
        }
    }
    /**
     * Sends a SPARQL update query to the stored endpoint.
     *
     * @param sparqlQuery - Query to send.
     */
    async sendSparqlUpdate(sparqlQuery) {
        const query = this.generator.stringify(sparqlQuery);
        this.logger.info(`Sending SPARQL UPDATE query to ${this.endpoint}: ${query}`);
        try {
            await this.fetcher.fetchUpdate(this.endpoint, query);
        }
        catch (error) {
            this.logger.error(`SPARQL endpoint ${this.endpoint} error: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            throw error;
        }
    }
}
exports.SparqlDataAccessor = SparqlDataAccessor;
//# sourceMappingURL=SparqlDataAccessor.js.map