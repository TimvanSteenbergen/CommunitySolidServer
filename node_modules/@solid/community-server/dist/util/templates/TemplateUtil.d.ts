import type { Template } from './TemplateEngine';
/**
 * Returns the absolute path to the template.
 * Returns undefined if the input does not contain a file path.
 */
export declare function getTemplateFilePath(template?: Template): string | undefined;
/**
 * Reads the template and returns it as a string.
 */
export declare function readTemplate(template?: Template): Promise<string>;
