import type { HttpRequest } from '../../../server/HttpRequest';
import { AsyncHandler } from '../../../util/handlers/AsyncHandler';
import type { ResourceIdentifier } from '../../representation/ResourceIdentifier';
/**
 * Extracts a {@link ResourceIdentifier} from an incoming {@link HttpRequest}.
 */
export declare abstract class TargetExtractor extends AsyncHandler<{
    request: HttpRequest;
}, ResourceIdentifier> {
}
