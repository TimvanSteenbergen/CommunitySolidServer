import type { RedirectHttpError } from '../../../util/errors/RedirectHttpError';
import { ResponseDescription } from './ResponseDescription';
/**
 * Corresponds to a redirect response, containing the relevant location metadata.
 */
export declare class RedirectResponseDescription extends ResponseDescription {
    constructor(error: RedirectHttpError);
}
