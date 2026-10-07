"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResourcesGenerator = void 0;
const node_fs_1 = require("node:fs");
const fs_extra_1 = require("fs-extra");
const n3_1 = require("n3");
const BasicRepresentation_1 = require("../../http/representation/BasicRepresentation");
const RepresentationMetadata_1 = require("../../http/representation/RepresentationMetadata");
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const GuardedStream_1 = require("../../util/GuardedStream");
const PathUtil_1 = require("../../util/PathUtil");
const ResourceUtil_1 = require("../../util/ResourceUtil");
const StreamUtil_1 = require("../../util/StreamUtil");
// Comparator for the results of the `groupLinks` call
function comparator(left, right) {
    return left.link.identifier.path.localeCompare(right.link.identifier.path);
}
/**
 * Generates resources by making use of a template engine.
 * The template folder structure will be kept.
 * Folders will be interpreted as containers and files as documents.
 * A FileIdentifierMapper will be used to generate identifiers that correspond to the relative structure.
 *
 * Metadata resources will be yielded separately from their subject resource.
 *
 * A relative `templateFolder` is resolved relative to cwd,
 * unless it's preceded by `@css:`, e.g. `@css:foo/bar`.
 */
class BaseResourcesGenerator {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    factory;
    templateEngine;
    templateExtension;
    metadataStrategy;
    store;
    /**
     * A mapper is needed to convert the template file paths to identifiers relative to the given base identifier.
     *
     * @param args - TemplatedResourcesGeneratorArgs
     */
    constructor(args) {
        this.factory = args.factory;
        this.templateEngine = args.templateEngine;
        this.templateExtension = args.templateExtension ?? '.hbs';
        this.metadataStrategy = args.metadataStrategy;
        this.store = args.store;
    }
    async *generate(templateFolder, location, options) {
        templateFolder = (0, PathUtil_1.resolveAssetPath)(templateFolder);
        // Ignore folders that don't exist
        if (!await (0, fs_extra_1.pathExists)(templateFolder)) {
            this.logger.warn(`Ignoring non-existing template folder ${templateFolder}`);
            return;
        }
        const mapper = await this.factory.create(location.path, templateFolder);
        const folderLink = await this.toTemplateLink(templateFolder, mapper);
        yield* this.processFolder(folderLink, mapper, options);
    }
    /**
     * Generates results for all entries in the given folder, including the folder itself.
     */
    async *processFolder(folderLink, mapper, options) {
        // Group resource links with their corresponding metadata links
        const links = await this.groupLinks(folderLink.filePath, mapper);
        // Remove root metadata if it exists
        const metaLink = links[folderLink.identifier.path]?.meta;
        delete links[folderLink.identifier.path];
        yield* this.generateResource(folderLink, options, metaLink);
        // Make sure the results are sorted
        for (const { link, meta } of Object.values(links).sort(comparator)) {
            if ((0, PathUtil_1.isContainerIdentifier)(link.identifier)) {
                yield* this.processFolder(link, mapper, options);
            }
            else {
                yield* this.generateResource(link, options, meta);
            }
        }
    }
    /**
     * Creates a TemplateResourceLink for the given filePath,
     * which connects a resource URL to its template file.
     * The identifier will be based on the file path stripped from the template extension,
     * but the filePath parameter will still point to the original file.
     */
    async toTemplateLink(filePath, mapper) {
        const stats = await node_fs_1.promises.lstat(filePath);
        // Slice the template extension from the filepath for correct identifier generation
        const isTemplate = filePath.endsWith(this.templateExtension);
        const slicedPath = isTemplate ? filePath.slice(0, -this.templateExtension.length) : filePath;
        const link = await mapper.mapFilePathToUrl(slicedPath, stats.isDirectory());
        // We still need the original file path for disk reading though
        return {
            ...link,
            filePath,
            isTemplate,
        };
    }
    /**
     * Generates TemplateResourceLinks for each entry in the given folder
     * and combines the results so resources and their metadata are grouped together.
     */
    async groupLinks(folderPath, mapper) {
        const files = await node_fs_1.promises.readdir(folderPath);
        const links = {};
        for (const name of files) {
            const link = await this.toTemplateLink((0, PathUtil_1.joinFilePath)(folderPath, name), mapper);
            const { path } = link.identifier;
            links[path] = Object.assign(links[path] || {}, link.isMetadata ? { meta: link } : { link });
        }
        return links;
    }
    /**
     * Generates a Resource object for the given ResourceLink.
     * In the case of documents the corresponding template will be used.
     * If a ResourceLink of metadata is provided the corresponding metadata resource
     * will be yielded as a separate resource.
     */
    async *generateResource(link, options, metaLink) {
        let data;
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(link.identifier);
        // Read file if it is not a container
        if (!(0, PathUtil_1.isContainerIdentifier)(link.identifier)) {
            data = await this.processFile(link, options);
            metadata.contentType = link.contentType;
        }
        // Add metadata from .meta file if there is one
        if (metaLink) {
            const rawMetadata = await this.generateMetadata(metaLink, options);
            if (rawMetadata.contentType) {
                // Prevent having 2 content types
                metadata.contentType = undefined;
            }
            metadata.setMetadata(rawMetadata);
            this.logger.debug(`Adding metadata for ${metaLink.identifier.path}`);
        }
        const shouldYield = !(0, PathUtil_1.isContainerIdentifier)(link.identifier) || !await this.store.hasResource(link.identifier);
        if (shouldYield) {
            this.logger.debug(`Generating resource ${link.identifier.path}`);
            yield {
                identifier: link.identifier,
                representation: new BasicRepresentation_1.BasicRepresentation(data ?? [], metadata),
            };
        }
        // Still need to yield metadata in case the actual resource is not being yielded.
        // We also do this for containers as existing containers can't be edited in the same way.
        if (metaLink && (!shouldYield || (0, PathUtil_1.isContainerIdentifier)(link.identifier))) {
            const metaIdentifier = this.metadataStrategy.getAuxiliaryIdentifier(link.identifier);
            (0, ResourceUtil_1.addResourceMetadata)(metadata, (0, PathUtil_1.isContainerIdentifier)(link.identifier));
            this.logger.debug(`Generating resource ${metaIdentifier.path}`);
            yield {
                identifier: metaIdentifier,
                representation: new BasicRepresentation_1.BasicRepresentation(metadata.quads(), metaIdentifier, ContentTypes_1.INTERNAL_QUADS),
            };
        }
    }
    /**
     * Generates a RepresentationMetadata using the given template.
     */
    async generateMetadata(metaLink, options) {
        const metadata = new RepresentationMetadata_1.RepresentationMetadata(metaLink.identifier);
        const data = await this.processFile(metaLink, options);
        const parser = new n3_1.Parser({ format: metaLink.contentType, baseIRI: metaLink.identifier.path });
        const quads = parser.parse(await (0, StreamUtil_1.readableToString)(data));
        metadata.addQuads(quads);
        return metadata;
    }
    /**
     * Creates a read stream from the file and applies the template if necessary.
     */
    async processFile(link, contents) {
        if (link.isTemplate) {
            const rendered = await this.templateEngine.handleSafe({ contents, template: { templateFile: link.filePath } });
            return (0, StreamUtil_1.guardedStreamFrom)(rendered);
        }
        return (0, GuardedStream_1.guardStream)((0, node_fs_1.createReadStream)(link.filePath));
    }
}
exports.BaseResourcesGenerator = BaseResourcesGenerator;
//# sourceMappingURL=BaseResourcesGenerator.js.map