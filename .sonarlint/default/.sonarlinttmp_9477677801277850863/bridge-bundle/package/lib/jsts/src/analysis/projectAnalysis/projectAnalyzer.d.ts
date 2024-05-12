import { ProjectAnalysisInput, ProjectAnalysisOutput } from './projectAnalysis';
/**
 * Analyzes a JavaScript / TypeScript project in a single run
 *
 * @param input the JavaScript / TypeScript project to analyze
 * @returns the JavaScript / TypeScript project analysis output
 */
export declare function analyzeProject(input: ProjectAnalysisInput): Promise<ProjectAnalysisOutput>;
