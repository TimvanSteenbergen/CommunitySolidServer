"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CUSTOM_TYPES = exports.INTERNAL_ERROR = exports.INTERNAL_QUADS = exports.INTERNAL_ALL = exports.TEXT_TURTLE = exports.TEXT_N3 = exports.TEXT_MARKDOWN = exports.TEXT_HTML = exports.APPLICATION_X_WWW_FORM_URLENCODED = exports.APPLICATION_SPARQL_UPDATE = exports.APPLICATION_OCTET_STREAM = exports.APPLICATION_LD_JSON = exports.APPLICATION_JSON = void 0;
// Well-known content types
exports.APPLICATION_JSON = 'application/json';
exports.APPLICATION_LD_JSON = 'application/ld+json';
exports.APPLICATION_OCTET_STREAM = 'application/octet-stream';
exports.APPLICATION_SPARQL_UPDATE = 'application/sparql-update';
exports.APPLICATION_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded';
exports.TEXT_HTML = 'text/html';
exports.TEXT_MARKDOWN = 'text/markdown';
exports.TEXT_N3 = 'text/n3';
exports.TEXT_TURTLE = 'text/turtle';
// Internal content types (not exposed over HTTP)
exports.INTERNAL_ALL = 'internal/*';
exports.INTERNAL_QUADS = 'internal/quads';
exports.INTERNAL_ERROR = 'internal/error';
exports.DEFAULT_CUSTOM_TYPES = {
    acl: exports.TEXT_TURTLE,
    acr: exports.TEXT_TURTLE,
    meta: exports.TEXT_TURTLE,
};
//# sourceMappingURL=ContentTypes.js.map