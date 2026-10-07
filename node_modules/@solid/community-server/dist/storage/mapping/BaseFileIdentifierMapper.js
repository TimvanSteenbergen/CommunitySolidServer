"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFileIdentifierMapper = void 0;
const LogUtil_1 = require("../../logging/LogUtil");
const ContentTypes_1 = require("../../util/ContentTypes");
const BadRequestHttpError_1 = require("../../util/errors/BadRequestHttpError");
const InternalServerError_1 = require("../../util/errors/InternalServerError");
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const PathUtil_1 = require("../../util/PathUtil");
/**
 * Base class for {@link FileIdentifierMapper} implementations.
 */
class BaseFileIdentifierMapper {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    baseRequestURI;
    rootFilepath;
    // Extension to use as a fallback when the media type is not supported (could be made configurable).
    unknownMediaTypeExtension = 'unknown';
    // Path suffix for metadata
    metadataSuffix = '.meta';
    constructor(base, rootFilepath) {
        this.baseRequestURI = (0, PathUtil_1.trimTrailingSlashes)(base);
        this.rootFilepath = (0, PathUtil_1.trimTrailingSlashes)((0, PathUtil_1.normalizeFilePath)(rootFilepath));
    }
    /**
     * Maps the given resource identifier / URL to a file path.
     * Determines the content type if none was provided.
     * For containers the content-type input is ignored.
     *
     * @param identifier - The input identifier.
     * @param isMetadata - If we need the data or metadata file path.
     * @param contentType - The content-type provided with the request.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapUrlToFilePath(identifier, isMetadata, contentType) {
        let path = this.getRelativePath(identifier);
        if (isMetadata) {
            path += this.metadataSuffix;
        }
        this.validateRelativePath(path, identifier);
        const filePath = this.getAbsolutePath(path);
        return (0, PathUtil_1.isContainerIdentifier)(identifier) ?
            this.mapUrlToContainerPath(identifier, filePath) :
            this.mapUrlToDocumentPath(identifier, filePath, contentType);
    }
    /**
     * Maps the given container identifier to a file path,
     * possibly making alterations to the direct translation.
     *
     * @param identifier - The input identifier.
     * @param filePath - The direct translation of the identifier onto the file path.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapUrlToContainerPath(identifier, filePath) {
        this.logger.debug(`URL ${identifier.path} points to the container ${filePath}`);
        return { identifier, filePath, isMetadata: this.isMetadataPath(filePath) };
    }
    /**
     * Maps the given document identifier to a file path,
     * possibly making alterations to the direct translation
     * (for instance, based on its content type)).
     * Determines the content type if none was provided.
     *
     * @param identifier - The input identifier.
     * @param filePath - The direct translation of the identifier onto the file path.
     * @param contentType - The content-type provided with the request.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapUrlToDocumentPath(identifier, filePath, contentType) {
        // Don't try to get content-type from URL when the file path refers to a document with unknown media type.
        if (!filePath.endsWith(`.${this.unknownMediaTypeExtension}`)) {
            contentType = await this.getContentTypeFromUrl(identifier, contentType);
        }
        this.logger.debug(`The path for ${identifier.path} is ${filePath}`);
        return { identifier, filePath, contentType, isMetadata: this.isMetadataPath(filePath) };
    }
    /**
     * Determines the content type from the document identifier.
     *
     * @param identifier - The input identifier.
     * @param contentType - The content-type provided with the request.
     *
     * @returns The content type of the document.
     */
    async getContentTypeFromUrl(identifier, contentType) {
        return contentType ?? ContentTypes_1.APPLICATION_OCTET_STREAM;
    }
    /**
     * Maps the given file path to a URL and determines its content type.
     *
     * @param filePath - The input file path.
     * @param isContainer - If the path corresponds to a file.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async mapFilePathToUrl(filePath, isContainer) {
        if (!filePath.startsWith(this.rootFilepath)) {
            this.logger.error(`Trying to access file ${filePath} outside of ${this.rootFilepath}`);
            throw new InternalServerError_1.InternalServerError(`File ${filePath} is not part of the file storage at ${this.rootFilepath}`);
        }
        const relative = filePath.slice(this.rootFilepath.length);
        let url;
        let contentType;
        if (isContainer) {
            url = await this.getContainerUrl(relative);
            this.logger.debug(`Container filepath ${filePath} maps to URL ${url}`);
        }
        else {
            url = await this.getDocumentUrl(relative);
            this.logger.debug(`Document ${filePath} maps to URL ${url}`);
            contentType = await this.getContentTypeFromPath(filePath);
        }
        const isMetadata = this.isMetadataPath(filePath);
        if (isMetadata) {
            url = url.slice(0, -this.metadataSuffix.length);
        }
        return { identifier: { path: url }, filePath, contentType, isMetadata };
    }
    /**
     * Maps the given container path to a URL and determines its content type.
     *
     * @param relative - The relative container path.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async getContainerUrl(relative) {
        return (0, PathUtil_1.ensureTrailingSlash)(this.baseRequestURI + (0, PathUtil_1.encodeUriPathComponents)(relative));
    }
    /**
     * Maps the given document path to a URL and determines its content type.
     *
     * @param relative - The relative document path.
     *
     * @returns A ResourceLink with all the necessary metadata.
     */
    async getDocumentUrl(relative) {
        return (0, PathUtil_1.trimTrailingSlashes)(this.baseRequestURI + (0, PathUtil_1.encodeUriPathComponents)(relative));
    }
    /**
     * Determines the content type from the relative path.
     *
     * @param filePath - The file path of the document.
     *
     * @returns The content type of the document.
     */
    // eslint-disable-next-line unused-imports/no-unused-vars
    async getContentTypeFromPath(filePath) {
        return ContentTypes_1.APPLICATION_OCTET_STREAM;
    }
    /**
     * Get the absolute file path based on the rootFilepath.
     *
     * @param path - The relative file path.
     *
     * @returns Absolute path of the file.
     */
    getAbsolutePath(path) {
        return (0, PathUtil_1.joinFilePath)(this.rootFilepath, path);
    }
    /**
     * Strips the baseRequestURI from the identifier.
     *
     * @param identifier - Incoming identifier.
     *
     * @returns A string representing the relative path.
     *
     * @throws NotFoundHttpError
     * If the identifier does not match the baseRequestURI.
     */
    getRelativePath(identifier) {
        if (!identifier.path.startsWith(this.baseRequestURI)) {
            this.logger.warn(`The URL ${identifier.path} is outside of the scope ${this.baseRequestURI}`);
            throw new NotFoundHttpError_1.NotFoundHttpError();
        }
        return (0, PathUtil_1.decodeUriPathComponents)(identifier.path.slice(this.baseRequestURI.length));
    }
    /**
     * Check whether the given relative path is valid.
     *
     * @param path - A relative path, as generated by {@link getRelativePath}.
     * @param identifier - A resource identifier.
     *
     * @throws BadRequestHttpError
     * If the relative path is invalid.
     */
    validateRelativePath(path, identifier) {
        if (!path.startsWith('/')) {
            this.logger.warn(`URL ${identifier.path} needs a / after the base`);
            throw new BadRequestHttpError_1.BadRequestHttpError('URL needs a / after the base');
        }
        if (path.includes('/../') || path.endsWith('/..')) {
            this.logger.warn(`Disallowed /../ segment in URL ${identifier.path}.`);
            throw new BadRequestHttpError_1.BadRequestHttpError('Disallowed /../ segment in URL');
        }
    }
    /**
     * Checks if the given path is a metadata path.
     */
    isMetadataPath(path) {
        return path.endsWith(this.metadataSuffix);
    }
}
exports.BaseFileIdentifierMapper = BaseFileIdentifierMapper;
//# sourceMappingURL=BaseFileIdentifierMapper.js.map