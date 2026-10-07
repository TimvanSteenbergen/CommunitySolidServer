import type { ComponentsManager } from 'componentsjs';
/**
 * Indicates a class is only meant to work in singlethreaded setups and is thus not threadsafe.
 */
export interface SingleThreaded {
}
/**
 * Convert an exported interface name to the properly expected Components.js type URI.
 *
 * @param componentsManager - The currently used ComponentsManager
 * @param interfaceName - An interface name
 *
 * @returns A Components.js type URI
 */
export declare function toComponentsJsType<T>(componentsManager: ComponentsManager<T>, interfaceName: string): Promise<string>;
/**
 * Will list class names of components instantiated implementing the {@link SingleThreaded}
 * interface while the application is being run in multithreaded mode.
 *
 * @param componentsManager - The componentsManager being used to set up the application
 */
export declare function listSingleThreadedComponents<T>(componentsManager: ComponentsManager<T>): Promise<string[]>;
