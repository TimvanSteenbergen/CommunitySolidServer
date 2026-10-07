import type { ResponseDescription } from '../response/ResponseDescription';
import type { ErrorHandlerArgs } from './ErrorHandler';
import { ErrorHandler } from './ErrorHandler';
/**
 * Internally we create redirects by throwing specific {@link RedirectHttpError}s.
 * This Error handler converts those to {@link RedirectResponseDescription}s that are used for output.
 */
export declare class RedirectingErrorHandler extends ErrorHandler {
    canHandle({ error }: ErrorHandlerArgs): Promise<void>;
    handle({ error }: ErrorHandlerArgs): Promise<ResponseDescription>;
}
