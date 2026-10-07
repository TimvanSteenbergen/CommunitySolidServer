"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSizeReporter = void 0;
const node_fs_1 = require("node:fs");
const PathUtil_1 = require("../../util/PathUtil");
const Size_1 = require("./Size");
/**
 * SizeReporter that is used to calculate sizes of resources for a file based system.
 */
class FileSizeReporter {
    fileIdentifierMapper;
    ignoreFolders;
    rootFilePath;
    constructor(fileIdentifierMapper, rootFilePath, ignoreFolders) {
        this.fileIdentifierMapper = fileIdentifierMapper;
        this.ignoreFolders = ignoreFolders ? ignoreFolders.map((folder) => new RegExp(folder, 'u')) : [];
        this.rootFilePath = (0, PathUtil_1.normalizeFilePath)(rootFilePath);
    }
    /** The FileSizeReporter will always return data in the form of bytes */
    getUnit() {
        return Size_1.UNIT_BYTES;
    }
    /**
     * Returns the size of the given resource ( and its children ) in bytes
     */
    async getSize(identifier) {
        const fileLocation = (await this.fileIdentifierMapper.mapUrlToFilePath(identifier, false)).filePath;
        return { unit: this.getUnit(), amount: await this.getTotalSize(fileLocation) };
    }
    async calculateChunkSize(chunk) {
        return chunk.length;
    }
    /** The estimated size of a resource in this reporter is simply the content-length header */
    async estimateSize(metadata) {
        return metadata.contentLength;
    }
    /**
     * Get the total size of a resource and its children if present
     *
     * @param fileLocation - the resource of which you want the total size of ( on disk )
     *
     * @returns a number specifying how many bytes are used by the resource
     */
    async getTotalSize(fileLocation) {
        let stat;
        // Check if the file exists
        try {
            stat = await node_fs_1.promises.stat(fileLocation);
        }
        catch {
            return 0;
        }
        // If the file's location points to a file, simply return the file's size
        if (stat.isFile()) {
            return stat.size;
        }
        // If the location DOES exist and is NOT a file it should be a directory
        // recursively add all sizes of children to the total
        const childFiles = await node_fs_1.promises.readdir(fileLocation);
        const rootFilePathLength = (0, PathUtil_1.trimTrailingSlashes)(this.rootFilePath).length;
        let totalSize = stat.size;
        for (const current of childFiles) {
            const childFileLocation = (0, PathUtil_1.normalizeFilePath)((0, PathUtil_1.joinFilePath)(fileLocation, current));
            // Exclude internal files
            if (!this.ignoreFolders.some((folder) => folder.test(childFileLocation.slice(rootFilePathLength)))) {
                totalSize += await this.getTotalSize(childFileLocation);
            }
        }
        return totalSize;
    }
}
exports.FileSizeReporter = FileSizeReporter;
//# sourceMappingURL=FileSizeReporter.js.map