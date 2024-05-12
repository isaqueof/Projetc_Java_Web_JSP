export * from './package-json';
/**
 * Minimum version per reference
 */
type MinimumVersions = {
    node?: string;
};
/**
 * Checks if context where the filename is located supports the provided
 * minimum versions.
 */
export declare function isSupported(filename: string, minVersions: MinimumVersions): boolean;
