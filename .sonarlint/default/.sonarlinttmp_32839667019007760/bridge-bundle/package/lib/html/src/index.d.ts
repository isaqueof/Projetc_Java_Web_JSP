import { EmbeddedAnalysisInput as HtmlAnalysisInput, EmbeddedAnalysisOutput as HtmlAnalysisOutput } from '@sonar/jsts';
export { HtmlAnalysisInput, HtmlAnalysisOutput };
export declare function analyzeHTML(input: HtmlAnalysisInput): Promise<HtmlAnalysisOutput>;
