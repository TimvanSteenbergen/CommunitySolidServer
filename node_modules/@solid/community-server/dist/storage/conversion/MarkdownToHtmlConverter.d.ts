import type { Representation } from '../../http/representation/Representation';
import type { TemplateEngine } from '../../util/templates/TemplateEngine';
import { BaseTypedRepresentationConverter } from './BaseTypedRepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Converts Markdown data to HTML.
 * The generated HTML will be injected into the given template using the parameter `htmlBody`.
 * A standard Markdown string will be converted to a <p> tag, so html and body tags should be part of the template.
 * In case the Markdown body starts with a header (#), that value will also be used as `title` parameter.
 */
export declare class MarkdownToHtmlConverter extends BaseTypedRepresentationConverter {
    private readonly templateEngine;
    constructor(templateEngine: TemplateEngine);
    handle({ representation }: RepresentationConverterArgs): Promise<Representation>;
}
