import { EmbeddedAnalysisInput as YamlAnalysisInput, EmbeddedAnalysisOutput as YamlAnalysisOutput } from '@sonar/jsts';
export { YamlAnalysisInput, YamlAnalysisOutput };
export declare function analyzeYAML(input: YamlAnalysisInput): Promise<YamlAnalysisOutput>;
