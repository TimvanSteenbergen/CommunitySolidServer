/**
 * General interface for all Accept* headers.
 */
export interface AcceptHeader {
    /** Requested range. Can be a specific value or `*`, matching all. */
    range: string;
    /** Weight of the preference [0, 1]. */
    weight: number;
}
/**
 * Contents of an HTTP Accept header.
 * Range is type/subtype. Both can be `*`.
 */
export interface Accept extends AcceptHeader {
    parameters: {
        /** Media type parameters. These are the parameters that came before the q value. */
        mediaType: Record<string, string>;
        /**
         * Extension parameters. These are the parameters that came after the q value.
         * Value will be an empty string if there was none.
         */
        extension: Record<string, string>;
    };
}
/**
 * Contents of an HTTP Accept-Charset header.
 */
export interface AcceptCharset extends AcceptHeader {
}
/**
 * Contents of an HTTP Accept-Encoding header.
 */
export interface AcceptEncoding extends AcceptHeader {
}
/**
 * Contents of an HTTP Accept-Language header.
 */
export interface AcceptLanguage extends AcceptHeader {
}
/**
 * Contents of an HTTP Accept-Datetime header.
 */
export interface AcceptDatetime extends AcceptHeader {
}
/**
 * Contents of an HTTP Content-Type Header.
 * Optional parameters Record is included.
 */
export declare class ContentType {
    value: string;
    parameters: Record<string, string>;
    constructor(value: string, parameters?: Record<string, string>);
    /**
     * Serialize this ContentType object to a ContentType header appropriate value string.
     *
     * @returns The value string, including parameters, if present.
     */
    toHeaderValueString(): string;
}
export interface LinkEntryParameters extends Record<string, string> {
    /** Required rel properties of Link entry */
    rel: string;
}
export interface LinkEntry {
    target: string;
    parameters: LinkEntryParameters;
}
export declare const TCHAR: RegExp;
export declare const TOKEN: RegExp;
export declare const SIMPLE_MEDIA_RANGE: RegExp;
export declare const QUOTED_STRING: RegExp;
export declare const QVALUE: RegExp;
