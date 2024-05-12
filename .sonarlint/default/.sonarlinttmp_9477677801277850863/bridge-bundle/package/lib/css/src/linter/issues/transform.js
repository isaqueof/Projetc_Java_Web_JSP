"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const shared_1 = require("@sonar/shared");
/**
 * Transforms Stylelint linting results into SonarQube issues
 * @param results the Stylelint linting results
 * @param filePath the path of the linted file
 * @returns the transformed SonarQube issues
 */
function transform(results, filePath) {
    const issues = [];
    /**
     * There should be only one element in 'results' as we are analyzing
     * only one file at a time.
     */
    results.forEach(result => {
        /** Avoids reporting on "fake" source like <input css 1>  */
        if (result.source !== filePath) {
            (0, shared_1.debug)(`For file [${filePath}] received issues with [${result.source}] as a source. They will not be reported.`);
            return;
        }
        result.warnings.forEach(warning => issues.push({
            ruleId: warning.rule,
            line: warning.line,
            column: warning.column,
            message: warning.text,
        }));
    });
    return issues;
}
exports.transform = transform;
//# sourceMappingURL=transform.js.map