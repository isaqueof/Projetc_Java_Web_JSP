import { JsTsFiles, ProjectAnalysisOutput } from '../../';
/**
 * Analyzes JavaScript / TypeScript files using TypeScript programs. Only the files
 * belonging to the given tsconfig.json files will be analyzed.
 *
 * @param files the list of JavaScript / TypeScript files to analyze.
 * @param tsConfigs list of tsconfig.json files to use for the analysis
 * @param results ProjectAnalysisOutput object where the analysis results are stored
 * @param pendingFiles array of files which are still not analyzed, to keep track of progress
 *                     and avoid analyzing twice the same file
 */
export declare function analyzeWithProgram(files: JsTsFiles, tsConfigs: AsyncGenerator<string>, results: ProjectAnalysisOutput, pendingFiles: Set<string>): Promise<void>;
