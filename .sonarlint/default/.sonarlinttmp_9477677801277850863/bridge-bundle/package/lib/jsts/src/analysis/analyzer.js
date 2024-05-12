"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeJSTS = void 0;
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
const shared_1 = require("@sonar/shared");
const linter_1 = require("../linter");
const builders_1 = require("../builders");
const monitoring_1 = require("../monitoring");
/**
 * Analyzes a JavaScript / TypeScript analysis input
 *
 * Analyzing a JavaScript / TypeScript analysis input implies building
 * an ESLint SourceCode instance, meaning parsing the actual code to get
 * an abstract syntax tree to operate on. Any parsing error is returned
 * immediately. Otherwise, the analysis proceeds with the actual linting
 * of the source code. The linting result is returned along with some
 * analysis performance data.
 *
 * The analysis requires that global linter wrapper is initialized.
 *
 * @param input the JavaScript / TypeScript analysis input to analyze
 * @param language the language of the analysis input
 * @returns the JavaScript / TypeScript analysis output
 */
function analyzeJSTS(input, language) {
    (0, shared_1.debug)(`Analyzing file "${input.filePath}" with linterId "${input.linterId}"`);
    const linter = (0, linter_1.getLinter)(input.linterId);
    const building = () => (0, builders_1.buildSourceCode)(input, language);
    const { result: built, duration: parseTime } = (0, monitoring_1.measureDuration)(building);
    const analysis = () => analyzeFile(linter, input, built);
    const { result: output, duration: analysisTime } = (0, monitoring_1.measureDuration)(analysis);
    return { ...output, perf: { parseTime, analysisTime } };
}
exports.analyzeJSTS = analyzeJSTS;
/**
 * Analyzes a parsed ESLint SourceCode instance
 *
 * Analyzing a parsed ESLint SourceCode instance consists in linting the source code
 * and computing extended metrics about the code. At this point, the linting results
 * are already SonarQube-compatible and can be consumed back as such by the sensor.
 *
 * @param linter the linter to use for the analysis
 * @param input the JavaScript / TypeScript analysis input to analyze
 * @param sourceCode the corresponding parsed ESLint SourceCode instance
 * @returns the JavaScript / TypeScript analysis output
 */
function analyzeFile(linter, input, sourceCode) {
    try {
        const { filePath, fileType, language } = input;
        const { issues, highlightedSymbols, cognitiveComplexity, ucfgPaths } = linter.lint(sourceCode, filePath, fileType, language);
        const extendedMetrics = computeExtendedMetrics(input, sourceCode, highlightedSymbols, cognitiveComplexity);
        return { issues, ucfgPaths, ...extendedMetrics };
    }
    catch (e) {
        /** Turns exceptions from TypeScript compiler into "parsing" errors */
        if (e.stack.indexOf('typescript.js:') > -1) {
            throw shared_1.APIError.failingTypeScriptError(e.message);
        }
        else {
            throw e;
        }
    }
}
/**
 * Computes extended metrics about the analyzed code
 *
 * Computed extended metrics may differ depending on the analysis context:
 *
 * - SonarLint doesn't care about code metrics except for `NOSONAR` comments
 * - All kinds of metrics are considered for main files.
 * - Symbol highlighting, syntax highlighting and `NOSONAR` comments are only consider
 *   for test files.
 *
 * @param input the JavaScript / TypeScript analysis input to analyze
 * @param sourceCode the analyzed ESLint SourceCode instance
 * @param highlightedSymbols the computed symbol highlighting of the code
 * @param cognitiveComplexity the computed cognitive complexity of the code
 * @returns the extended metrics of the code
 */
function computeExtendedMetrics(input, sourceCode, highlightedSymbols, cognitiveComplexity) {
    if ((0, shared_1.getContext)().sonarlint) {
        return { metrics: (0, linter_1.findNoSonarLines)(sourceCode) };
    }
    const { fileType, ignoreHeaderComments } = input;
    if (fileType === 'MAIN') {
        return {
            highlightedSymbols,
            highlights: (0, linter_1.getSyntaxHighlighting)(sourceCode).highlights,
            metrics: (0, linter_1.computeMetrics)(sourceCode, !!ignoreHeaderComments, cognitiveComplexity),
            cpdTokens: (0, linter_1.getCpdTokens)(sourceCode).cpdTokens,
        };
    }
    else {
        return {
            highlightedSymbols,
            highlights: (0, linter_1.getSyntaxHighlighting)(sourceCode).highlights,
            metrics: (0, linter_1.findNoSonarLines)(sourceCode),
        };
    }
}
//# sourceMappingURL=analyzer.js.map