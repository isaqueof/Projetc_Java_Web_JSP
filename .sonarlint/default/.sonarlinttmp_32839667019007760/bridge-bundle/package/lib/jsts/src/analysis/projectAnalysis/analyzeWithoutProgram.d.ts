import { JsTsFiles, ProjectAnalysisOutput } from '../../';
/**
 * Analyzes JavaScript / TypeScript files without type-checking.
 *
 * @param filenames the list of JavaScript / TypeScript files to analyze.
 * @param files the list of JavaScript / TypeScript files objects containing the files input data.
 * @param results ProjectAnalysisOutput object where the analysis results are stored
 */
export declare function analyzeWithoutProgram(filenames: Set<string>, files: JsTsFiles, results: ProjectAnalysisOutput): Promise<void>;
