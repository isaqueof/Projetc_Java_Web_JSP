/**
 * The type of input file
 *
 * The scanner indexes input files based on the project configuration,
 * if any. It determines wheter an input file denotes a `MAIN` file,
 * i.e., a source file, or a `TEST` file.
 *
 * The type of input file is then used by the linter to select which
 * rule configurations to apply, that is, which rules the linter should
 * use to analyze the file.
 */
export type FileType = 'MAIN' | 'TEST';
/**
 * Asynchronous read of file contents from a file path
 *
 * The function gets rid of any Byte Order Marker (BOM)
 * present in the file's header.
 *
 * @param filePath the path of a file
 * @returns Promise which resolves with the content of the file
 */
export declare function readFile(filePath: string): Promise<string>;
/**
 * Synchronous read of file contents from a file path
 *
 * The function gets rid of any Byte Order Marker (BOM)
 * present in the file's header.
 *
 * @param filePath the path of a file
 * @returns Promise which resolves with the content of the file
 */
export declare function readFileSync(filePath: string): string;
/**
 * Removes any Byte Order Marker (BOM) from a string's head
 *
 * A string's head is nothing else but its first character.
 *
 * @param str the input string
 * @returns the stripped string
 */
export declare function stripBOM(str: string): string;
/**
 * Converts a path to Unix format
 * @param path the path to convert
 * @returns the converted path
 */
export declare function toUnixPath(path: string): string;
/**
 * Adds tsconfig.json to a path if it does not exist
 *
 * @param tsConfig
 */
export declare function addTsConfigIfDirectory(tsConfig: string): string | null;
/**
 * Asynchronous check if file is readable.
 *
 * @param path the file path
 * @returns true if file is readable. false otherwise
 */
export declare function fileReadable(path: string): Promise<boolean>;
