"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedContentTypeMapper = void 0;
const NotFoundHttpError_1 = require("../../util/errors/NotFoundHttpError");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const BaseFileIdentifierMapper_1 = require("./BaseFileIdentifierMapper");
/**
 * A mapper that always returns a fixed content type for files.
 */
class FixedContentTypeMapper extends BaseFileIdentifierMapper_1.BaseFileIdentifierMapper {
    contentType;
    pathSuffix;
    urlSuffix;
    /**
     * @param base - Base URL.
     * @param rootFilepath - Base file path.
     * @param contentType - Fixed content type that will be used for all resources.
     * @param pathSuffix - An optional suffix that will be appended to all file paths.
     *                     Requested file paths without this suffix will be rejected.
     * @param urlSuffix - An optional suffix that will be appended to all URL.
     *                    Requested URLs without this suffix will be rejected.
     */
    constructor(base, rootFilepath, contentType, pathSuffix = '', urlSuffix = '') {
        super(base, rootFilepath);
        this.contentType = contentType;
        this.pathSuffix = pathSuffix;
        this.urlSuffix = urlSuffix;
    }
    async getContentTypeFromUrl(identifier, contentType) {
        // Only allow the configured content type
        if (contentType && contentType !== this.contentType) {
            throw new NotImplementedHttpError_1.NotImplementedHttpError(`Unsupported content type ${contentType}, only ${this.contentType} is allowed`);
        }
        return this.contentType;
    }
    async getContentTypeFromPath() {
        return this.contentType;
    }
    async mapUrlToDocumentPath(identifier, filePath, contentType) {
        // Handle URL suffix
        if (this.urlSuffix) {
            if (filePath.endsWith(this.urlSuffix)) {
                filePath = filePath.slice(0, -this.urlSuffix.length);
            }
            else {
                this.logger.warn(`Trying to access URL ${filePath} outside without required suffix ${this.urlSuffix}`);
                throw new NotFoundHttpError_1.NotFoundHttpError(`Trying to access URL ${filePath} outside without required suffix ${this.urlSuffix}`);
            }
        }
        return super.mapUrlToDocumentPath(identifier, filePath + this.pathSuffix, contentType);
    }
    async getDocumentUrl(relative) {
        // Handle path suffix, but ignore metadata files
        if (this.pathSuffix && !this.isMetadataPath(relative)) {
            if (relative.endsWith(this.pathSuffix)) {
                relative = relative.slice(0, -this.pathSuffix.length);
            }
            else {
                this.logger.warn(`Trying to access file ${relative} outside without required suffix ${this.pathSuffix}`);
                throw new NotFoundHttpError_1.NotFoundHttpError(`File ${relative} is not part of the file storage at ${this.rootFilepath}`);
            }
        }
        return super.getDocumentUrl(relative + this.urlSuffix);
    }
}
exports.FixedContentTypeMapper = FixedContentTypeMapper;
//# sourceMappingURL=FixedContentTypeMapper.js.map