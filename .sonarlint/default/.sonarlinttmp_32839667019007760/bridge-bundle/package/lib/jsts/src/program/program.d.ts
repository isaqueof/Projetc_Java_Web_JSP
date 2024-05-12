/**
 * This file provides an API to take control over TypeScript's Program instances
 * in the context of program-based analysis for JavaScript / TypeScript.
 *
 * A TypeScript's Program instance is used by TypeScript ESLint parser in order
 * to make available TypeScript's type checker for rules willing to use type
 * information for the sake of precision. It works similarly as using TSConfigs
 * except it gives the control over the lifecycle of this internal data structure
 * used by the parser and improves performance.
 */
import ts from 'typescript';
import { TsConfigJson } from 'type-fest';
export type ProgramResult = {
    files: string[];
    projectReferences: string[];
    missingTsConfig: boolean;
    program: ts.Program;
    programId?: string;
};
/**
 * Gets the files resolved by a TSConfig
 *
 * The resolving of the files for a given TSConfig file is done
 * by invoking TypeScript compiler.
 *
 * @param tsConfig TSConfig to parse
 * @param tsconfigContents TSConfig contents that we want to provide to TSConfig
 * @returns the resolved TSConfig files
 */
export declare function createProgramOptions(tsConfig: string, tsconfigContents?: string): ts.CreateProgramOptions & {
    missingTsConfig: boolean;
};
/**
 * Creates a TypeScript's Program instance
 *
 * TypeScript creates a Program instance per TSConfig file. This means that one
 * needs a TSConfig to create such a program. Therefore, the function expects a
 * TSConfig as an input, parses it and uses it to create a TypeScript's Program
 * instance. The program creation delegates to TypeScript the resolving of input
 * files considered by the TSConfig as well as any project references.
 *
 * @param tsConfig the TSConfig input to create a program for
 * @param tsconfigContents TSConfig contents that we want to provide to TSConfig
 * @returns the identifier of the created TypeScript's Program along with the
 *          program itself, the resolved files, project references and a boolean
 *          'missingTsConfig' which is true when an extended tsconfig.json path
 *          was not found, which defaulted to default Typescript configuration
 */
export declare function createProgram(tsConfig: string, tsconfigContents?: string): ProgramResult;
/**
 * Creates a TypeScript's Program instance and saves it in memory
 *
 * To be removed once Java part does not handle program creation
 */
export declare function createAndSaveProgram(tsConfig: string): ProgramResult & {
    programId: string;
};
/**
 * Gets an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to retrieve
 * @throws a runtime error if there is no such program
 * @returns the retrieved TypeScript's Program
 */
export declare function getProgramById(programId: string): ts.Program;
/**
 * Deletes an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to delete
 */
export declare function deleteProgram(programId: string): void;
export declare function isRootNodeModules(file: string): boolean;
export declare function isRoot(file: string): boolean;
/**
 * Create the TSConfig file and returns its path.
 *
 * The file is written in a temporary location in the file system
 * and is marked to be removed after Node.js process terminates.
 *
 * @param tsConfig TSConfig to write
 * @returns the resolved TSConfig file path
 */
export declare function writeTSConfigFile(tsConfig: TsConfigJson): Promise<{
    filename: string;
}>;
/**
 * Create and return a TSConfig object.
 *
 * @param files array of files included in the TS program
 * @param include inclusion paths of the TS Program
 * @returns the TSConfig object
 */
export declare function createTSConfigFile(files?: string[], include?: string[]): TsConfigJson;
