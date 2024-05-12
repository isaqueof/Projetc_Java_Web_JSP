"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeEmbedded = void 0;
const linter_1 = require("../../linter");
const builder_1 = require("../builder");
const shared_1 = require("@sonar/shared");
const monitoring_1 = require("../../monitoring");
const ncloc_1 = require("../../linter/visitors/metrics/ncloc");
/**
 * Analyzes a file containing JS snippets
 *
 * Analyzing embedded JS is part of analyzing inline JavaScript code
 * within various file formats: YAML, HTML, etc. The function first starts by parsing
 * the whole file to validate its syntax and to get in return an abstract syntax
 * tree. This abstract syntax tree is then used to extract embedded JavaScript
 * code. As files might embed several JavaScript snippets, the function
 * builds an ESLint SourceCode instance for each snippet using the same utility
 * as for building source code for regular JavaScript analysis inputs. However,
 * since a file can potentially produce multiple ESLint SourceCode instances,
 * the function stops to the first JavaScript parsing error and returns it without
 * considering any other. If all abstract syntax trees are valid, the function
 * then proceeds with linting each of them, aggregates, and returns the results.
 *
 * The analysis requires that global linter wrapper is initialized.
 *
 * @param input the analysis input
 * @param languageParser the parser for the language of the file containing the JS code
 * @returns the analysis output
 */
function analyzeEmbedded(input, languageParser) {
    (0, shared_1.debug)(`Analyzing file "${input.filePath}" with linterId "${input.linterId}"`);
    const linter = (0, linter_1.getLinter)(input.linterId);
    const building = () => (0, builder_1.buildSourceCodes)(input, languageParser);
    const { result: extendedSourceCodes, duration: parseTime } = (0, monitoring_1.measureDuration)(building);
    const analysis = () => analyzeFile(linter, extendedSourceCodes);
    const { result: output, duration: analysisTime } = (0, monitoring_1.measureDuration)(analysis);
    return {
        ...output,
        perf: { parseTime, analysisTime },
    };
}
exports.analyzeEmbedded = analyzeEmbedded;
/**
 * Extracted logic from analyzeEmbedded() so we can compute metrics
 *
 * @param linter
 * @param extendedSourceCodes
 * @returns
 */
function analyzeFile(linter, extendedSourceCodes) {
    const aggregatedIssues = [];
    const aggregatedUcfgPaths = [];
    let ncloc = [];
    for (const extendedSourceCode of extendedSourceCodes) {
        const { issues, ucfgPaths, ncloc: singleNcLoc } = analyzeSnippet(linter, extendedSourceCode);
        ncloc = ncloc.concat(singleNcLoc);
        const filteredIssues = removeNonJsIssues(extendedSourceCode, issues);
        aggregatedIssues.push(...filteredIssues);
        aggregatedUcfgPaths.push(...ucfgPaths);
    }
    return {
        issues: aggregatedIssues,
        ucfgPaths: aggregatedUcfgPaths,
        metrics: { ncloc },
    };
    function analyzeSnippet(linter, extendedSourceCode) {
        const { issues, ucfgPaths } = linter.lint(extendedSourceCode, extendedSourceCode.syntheticFilePath, 'MAIN');
        const ncloc = (0, ncloc_1.findNcloc)(extendedSourceCode);
        return { issues, ucfgPaths, ncloc };
    }
    /**
     * Filters out issues outside of JS code.
     *
     * This is necessary because we patch the SourceCode object
     * to include the whole file in its properties outside its AST.
     * So rules that operate on SourceCode.text get flagged.
     */
    function removeNonJsIssues(sourceCode, issues) {
        const [jsStart, jsEnd] = sourceCode.ast.range.map(offset => sourceCode.getLocFromIndex(offset));
        return issues.filter(issue => {
            const issueStart = { line: issue.line, column: issue.column };
            return isBeforeOrEqual(jsStart, issueStart) && isBeforeOrEqual(issueStart, jsEnd);
        });
        function isBeforeOrEqual(a, b) {
            if (a.line < b.line) {
                return true;
            }
            else if (a.line > b.line) {
                return false;
            }
            else {
                return a.column <= b.column;
            }
        }
    }
}
//# sourceMappingURL=analyzer.js.map