type ParserFunction = (filename: string, contents: string | null) => unknown;
type RawFilter = {
    pattern: string;
    parser?: ParserFunction;
};
/**
 * filterId -> filter
 */
type RawFilterMap = Record<string, RawFilter>;
export interface File<T> {
    filename: string;
    contents: T;
}
/**
 * filterId -> dirname -> files
 */
type FilesByFilter = {
    [filter: string]: Record<string, File<unknown>[]>;
};
/**
 * Traverse the directory tree recursively from `dir` and
 * gather files matching the `inclusionFilters`
 * that were not matching the `exclusionPatterns`.
 *
 * @param rawDir directory where the search starts
 * @param inclusionFilters glob patterns to search for, and parser function
 * @param exclusions glob patterns to ignore while walking the tree
 */
export declare function searchFiles(rawDir: string, inclusionFilters: RawFilterMap, exclusions: string[]): FilesByFilter;
export {};
