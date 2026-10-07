"use strict";
// The interfaces here are split off from HttpErrorUtil.ts to prevent a dependency loop in RepresentationMetadata
Object.defineProperty(exports, "__esModule", { value: true });
exports.QVALUE = exports.QUOTED_STRING = exports.SIMPLE_MEDIA_RANGE = exports.TOKEN = exports.TCHAR = exports.ContentType = void 0;
/**
 * Contents of an HTTP Content-Type Header.
 * Optional parameters Record is included.
 */
class ContentType {
    value;
    parameters;
    constructor(value, parameters = {}) {
        this.value = value;
        this.parameters = parameters;
    }
    /**
     * Serialize this ContentType object to a ContentType header appropriate value string.
     *
     * @returns The value string, including parameters, if present.
     */
    toHeaderValueString() {
        const parameterStrings = Object.entries(this.parameters)
            .sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]))
            .map(([key, value]) => `${key}=${value}`);
        return [this.value, ...parameterStrings].join('; ');
    }
}
exports.ContentType = ContentType;
// BNF based on https://tools.ietf.org/html/rfc7231
//
// media-type = type "/" subtype *( OWS ";" OWS parameter )
//
// media-range    = ( "*/*"
//                / ( type "/" "*" )
//                / ( type "/" subtype )
//                ) *( OWS ";" OWS parameter ) ; media type parameters
// accept-params  = weight *( accept-ext )
// accept-ext     = OWS ";" OWS token [ "=" ( token / quoted-string ) ] ; extension parameters
//
// weight = OWS ";" OWS "q=" qvalue
// qvalue = ( "0" [ "." 0*3DIGIT ] )
//        / ( "1" [ "." 0*3("0") ] )
//
// type       = token
// subtype    = token
// parameter  = token "=" ( token / quoted-string )
//
// quoted-string  = DQUOTE *( qdtext / quoted-pair ) DQUOTE
// qdtext         = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
// obs-text       = %x80-FF
// quoted-pair    = "\" ( HTAB / SP / VCHAR / obs-text )
//
// charset = token
//
// codings          = content-coding / "identity" / "*"
// content-coding   = token
//
// language-range   = (1*8ALPHA *("-" 1*8alphanum)) / "*"
// alphanum         = ALPHA / DIGIT
//
// Delimiters are chosen from the set of US-ASCII visual characters
// not allowed in a token (DQUOTE and "(),/:;<=>?@[\]{}").
// token          = 1*tchar
// tchar          = "!" / "#" / "$" / "%" / "&" / "'" / "*"
//                / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
//                / DIGIT / ALPHA
//                ; any VCHAR, except delimiters
//
// REUSED REGEXES
exports.TCHAR = /[-\w!#$%&'*+.^`|~]/u;
exports.TOKEN = new RegExp(`^${exports.TCHAR.source}+$`, 'u');
exports.SIMPLE_MEDIA_RANGE = new RegExp(`^${exports.TCHAR.source}+/${exports.TCHAR.source}+$`, 'u');
exports.QUOTED_STRING = /^"(?:[\t !\u0023-\u005B\u005D-\u007E\u0080-\u00FF]|(\\[\t\u0020-\u007E\u0080-\u00FF]))*"$/u;
exports.QVALUE = /^(?:(0(?:\.\d{0,3})?)|(1(?:\.0{0,3})?))$/u;
//# sourceMappingURL=Header.js.map