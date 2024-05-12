import { File } from '@sonar/shared';
import { PackageJson } from 'type-fest';
export declare const PACKAGE_JSON = "package.json";
export declare const parsePackageJson: (_filename: string, contents: string | null) => PackageJson;
export declare function loadPackageJsons(baseDir: string, exclusions: string[]): void;
export declare function getAllPackageJsons(): Record<string, File<PackageJson>[]>;
export declare function getPackageJsonsCount(): number;
export declare function clearPackageJsons(): void;
export declare function setPackageJsons(db: Record<string, File<PackageJson>[]>): void;
/**
 * Retrieve the dependencies of all the package.json files available for the given file.
 *
 * @param fileName context.filename
 * @returns
 */
export declare function getDependencies(fileName: string): Set<string>;
/**
 * Given a filename, return all package.json files in the ancestor paths
 * ordered from nearest to furthest
 *
 * @param file source file for which we need a package.json
 */
export declare function getNearestPackageJsons(file: string): File<PackageJson>[];
