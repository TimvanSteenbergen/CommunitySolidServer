import type { Representation } from '../../http/representation/Representation';
import type { TemplateEngine } from '../../util/templates/TemplateEngine';
import { RepresentationConverter } from './RepresentationConverter';
import type { RepresentationConverterArgs } from './RepresentationConverter';
/**
 * Converts JSON data by using it as input parameters for rendering a template.
 * The `extension` field can be used to only support a specific type of templates,
 * such as ".ejs" for EJS templates.
 *
 * To find the templates it expects the Representation metadata to contain `SOLID_META.template` triples,
 * with the objects being the template paths.
 * For each of those templates there also needs to be a CONTENT_TYPE triple
 * describing the content-type of that template.
 *
 * The output of the result depends on the content-type matched with the template.
 * In case JSON is the most preferred output type,
 * the input representation will be returned unless a JSON template is defined.
 */
export declare class DynamicJsonToTemplateConverter extends RepresentationConverter {
    private readonly templateEngine;
    constructor(templateEngine: TemplateEngine);
    canHandle(input: RepresentationConverterArgs): Promise<void>;
    handle(input: RepresentationConverterArgs): Promise<Representation>;
    /**
     * Uses the metadata of the Representation to create a map where each key is a content-type
     * and each value is the path of the corresponding template.
     */
    private constructTypeMap;
    /**
     * Finds the best content-type to convert to based on the provided templates and preferences.
     */
    private findType;
}
