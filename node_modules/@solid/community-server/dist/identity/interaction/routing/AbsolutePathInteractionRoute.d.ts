import type { EmptyObject } from '../../../util/map/MapUtil';
import type { InteractionRoute } from './InteractionRoute';
/**
 * A route that stores a single absolute path.
 */
export declare class AbsolutePathInteractionRoute implements InteractionRoute {
    private readonly path;
    constructor(path: string, ensureSlash?: boolean);
    getPath(): string;
    matchPath(path: string): EmptyObject | undefined;
}
