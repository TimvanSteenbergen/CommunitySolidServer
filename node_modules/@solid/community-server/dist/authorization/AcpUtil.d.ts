import type { IAccessControl, IAccessControlledResource, IAccessControlResource, IMatcher, IPolicy } from '@solid/access-control-policy';
import type { Store } from 'n3';
import type { Term } from '@rdfjs/types';
/**
 * Finds the {@link IMatcher} with the given identifier in the given dataset.
 *
 * @param data - Dataset to look in.
 * @param matcher - Identifier of the matcher.
 */
export declare function getMatcher(data: Store, matcher: Term): IMatcher;
/**
 * Finds the {@link IPolicy} with the given identifier in the given dataset.
 *
 * @param data - Dataset to look in.
 * @param policy - Identifier of the policy.
 */
export declare function getPolicy(data: Store, policy: Term): IPolicy;
/**
 * Finds the {@link IAccessControl} with the given identifier in the given dataset.
 *
 * @param data - Dataset to look in.
 * @param accessControl - Identifier of the access control.
 */
export declare function getAccessControl(data: Store, accessControl: Term): IAccessControl;
/**
 * Finds the {@link IAccessControlResource} with the given identifier in the given dataset.
 *
 * @param data - Dataset to look in.
 * @param acr - Identifier of the access control resource.
 */
export declare function getAccessControlResource(data: Store, acr: Term): IAccessControlResource;
/**
 * Finds all {@link IAccessControlledResource} in the given dataset.
 *
 * @param data - Dataset to look in.
 */
export declare function getAccessControlledResources(data: Store): Iterable<IAccessControlledResource>;
