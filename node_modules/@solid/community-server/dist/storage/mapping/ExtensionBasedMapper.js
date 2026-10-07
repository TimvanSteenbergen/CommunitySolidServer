"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionBasedMapperFactory = exports.ExtensionBasedMapper = void 0;
const node_fs_1 = require("node:fs");
const mime = __importStar(require("mime-types"));
const ContentTypes_1 = require("../../util/ContentTypes");
const NotImplementedHttpError_1 = require("../../util/errors/NotImplementedHttpError");
const PathUtil_1 = require("../../util/PathUtil");
const BaseFileIdentifierMapper_1 = require("./BaseFileIdentifierMapper");
/**
 * Supports the behaviour described in https://www.w3.org/DesignIssues/HTTPFilenameMapping.html
 * Determines content-type based on the file extension.
 * In case an identifier does not end on an extension matching its content-type,
 * the corresponding file will be appended with the correct extension, preceded by $.
 */
class ExtensionBasedMapper extends BaseFileIdentifierMapper_1.BaseFileIdentifierMapper {
    customTypes;
    customExtensions;
    constructor(base, rootFilepath, customTypes) {
        super(base, rootFilepath);
        // Workaround for https://github.com/LinkedSoftwareDependencies/Components.js/issues/20
        if (!customTypes || Object.keys(customTypes).length === 0) {
            this.customTypes = ContentTypes_1.DEFAULT_CUSTOM_TYPES;
        }
        else {
            this.customTypes = customTypes;
        }
        this.customExtensions = {};
        for (const [extension, contentType] of Object.entries(this.customTypes)) {
            this.customExtensions[contentType] = extension;
        }
    }
    async mapUrlToDocumentPath(identifier, filePath, contentType) {
        // Would conflict with how new extensions are stored
        if (/\$\.\w+$/u.test(filePath)) {
            this.logger.warn(`Identifier ${identifier.path} contains a dollar sign before its extension`);
            throw new NotImplementedHttpError_1.NotImplementedHttpError('Identifiers cannot contain a dollar sign before their extension');
        }
        // Existing file
        if (!contentType) {
            // Find a matching file
            const [, folder, documentName] = /^(.*\/)([^/]*)$/u.exec(filePath);
            let fileName;
            try {
                const files = await node_fs_1.promises.readdir(folder);
                fileName = files.find((file) => file.startsWith(documentName) && /^(?:\$\..+)?$/u.test(file.slice(documentName.length)));
            }
            catch {
                // Parent folder does not exist (or is not a folder)
            }
            if (fileName) {
                filePath = (0, PathUtil_1.joinFilePath)(folder, fileName);
            }
            contentType = await this.getContentTypeFromPath(filePath);
            // If the extension of the identifier matches a different content-type than the one that is given,
            // we need to add a new extension to match the correct type.
        }
        else if (contentType !== await this.getContentTypeFromPath(filePath)) {
            let extension = mime.extension(contentType) || this.customExtensions[contentType];
            if (!extension) {
                // When no extension is found for the provided content-type, use a fallback extension.
                extension = this.unknownMediaTypeExtension;
                // Signal the fallback by setting the content-type to undefined in the output link.
                contentType = undefined;
            }
            filePath += `$.${extension}`;
        }
        return super.mapUrlToDocumentPath(identifier, filePath, contentType);
    }
    async getDocumentUrl(relative) {
        return super.getDocumentUrl(this.stripExtension(relative));
    }
    async getContentTypeFromPath(filePath) {
        const extension = (0, PathUtil_1.getExtension)(filePath).toLowerCase();
        return mime.lookup(extension) ||
            this.customTypes[extension] ||
            await super.getContentTypeFromPath(filePath);
    }
    /**
     * Helper function that removes the internal extension, one starting with $., from the given path.
     * Nothing happens if no such extension is present.
     */
    stripExtension(path) {
        const extension = (0, PathUtil_1.getExtension)(path);
        if (extension && path.endsWith(`$.${extension}`)) {
            path = path.slice(0, -(extension.length + 2));
        }
        return path;
    }
}
exports.ExtensionBasedMapper = ExtensionBasedMapper;
class ExtensionBasedMapperFactory {
    async create(base, rootFilePath) {
        return new ExtensionBasedMapper(base, rootFilePath);
    }
}
exports.ExtensionBasedMapperFactory = ExtensionBasedMapperFactory;
//# sourceMappingURL=ExtensionBasedMapper.js.map