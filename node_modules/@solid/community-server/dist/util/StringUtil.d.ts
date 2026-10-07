/**
 * Splits a string by comma.
 *
 * @param input - String instance to split.
 *
 * @returns A String array containining the split parts.
 */
export declare function splitCommaSeparated(input: string): string[];
/**
 * Sanitizes part of a URL by replacing non-word content with a '-'.
 *
 * @param urlPart - The URL part to sanitize.
 *
 * @returns The sanitized output.
 */
export declare function sanitizeUrlPart(urlPart: string): string;
/**
 * Checks the validity of a file name. A valid name consists of word characters, '-' or '.'.
 *
 * @param name - The name of the file to validate.
 *
 * @returns True if the filename is valid, false otherwise.
 */
export declare function isValidFileName(name: string): boolean;
/**
 * Checks whether the given string is a valid URL.
 *
 * @param url - String to check.
 *
 * @returns True if the string is a valid URL.
 */
export declare function isUrl(url: string): boolean;
/**
 * Converts milliseconds to an ISO 8601 duration string.
 * The only categories used are days, hours, minutes, and seconds,
 * because months have no fixed size in milliseconds.
 *
 * @param ms - The duration in ms to convert.
 */
export declare function msToDuration(ms: number): string;
