import type { Representation } from '../../http/representation/Representation';
import type { TemplateEngine } from '../../util/templates/TemplateEngine';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
export interface TemplateOptions {
    mainTemplatePath?: string;
    codeTemplatesPath?: string;
    extension?: string;
    contentType?: string;
}
/**
 * Serializes an Error by filling in the provided template.
 * Content-type is based on the constructor parameter.
 *
 * In case the input Error has an `errorCode` value,
 * the converter will look in the `descriptions` for a file
 * with the exact same name as that error code + `extension`.
 * The templating engine will then be applied to that file.
 * That result will be passed as an additional parameter to the main templating call,
 * using the variable `codeMessage`.
 */
export declare class ErrorToTemplateConverter extends BaseTypedRepresentationConverter {
    private readonly templateEngine;
    private readonly mainTemplatePath;
    private readonly codeTemplatesPath;
    private readonly extension;
    private readonly contentType;
    constructor(templateEngine: TemplateEngine, templateOptions?: TemplateOptions);
    handle({ representation }: RepresentationConverterArgs): Promise<Representation>;
}
