import { Perf } from 'jsts/src/monitoring';
import { Issue } from '../../linter';
import { AnalysisInput, AnalysisOutput } from '@sonar/shared';
/**
 * An analysis input of embedded code
 *
 * (currently empty but might change later on)
 */
export interface EmbeddedAnalysisInput extends AnalysisInput {
}
/**
 * A YAML analysis output
 *
 * A YAML analysis only returns issues that were found during
 * linting. Because the JavaScript analyzer doesn't "own" the
 * `YAML` language, it cannot save anything else than issues
 * using SonarQube API, especially analysis data like metrics.
 *
 * @param issues the found issues
 */
export interface EmbeddedAnalysisOutput extends AnalysisOutput {
    issues: Issue[];
    ucfgPaths?: string[];
    perf: Perf;
    metrics: {
        ncloc: number[];
    };
}
