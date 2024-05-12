import { JsTsAnalysisInput } from '../../';
/**
 * Safely analyze a JavaScript/TypeScript file wrapping raised exceptions in the output format
 * @param input JsTsAnalysisInput object containing all the data necessary for the analysis
 */
export declare function analyzeFile(input: JsTsAnalysisInput): import("../analysis").JsTsAnalysisOutput;
