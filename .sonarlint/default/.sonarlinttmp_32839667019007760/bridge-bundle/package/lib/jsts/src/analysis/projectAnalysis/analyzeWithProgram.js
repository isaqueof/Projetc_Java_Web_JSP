"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeWithProgram = void 0;
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
const __1 = require("../../");
const shared_1 = require("@sonar/shared");
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
async function analyzeWithProgram(files, tsConfigs, results, pendingFiles) {
    for await (const tsConfig of tsConfigs) {
        await analyzeProgram(files, tsConfig, results, pendingFiles);
        if (!pendingFiles.size) {
            break;
        }
    }
}
exports.analyzeWithProgram = analyzeWithProgram;
async function analyzeProgram(files, tsConfig, results, pendingFiles) {
    let filenames, programId, projectReferences;
    try {
        ({ files: filenames, programId, projectReferences } = (0, __1.createAndSaveProgram)(tsConfig));
    }
    catch (e) {
        (0, shared_1.error)('Failed to create program: ' + e);
        return;
    }
    results.meta?.programsCreated.push(tsConfig);
    for (const filename of filenames) {
        // only analyze files which are requested
        if (files[filename] && pendingFiles.has(filename)) {
            results.files[filename] = (0, __1.analyzeFile)({
                filePath: filename,
                fileContent: files[filename].fileContent ?? (await (0, shared_1.readFile)(filename)),
                fileType: files[filename].fileType,
                language: files[filename].language ?? __1.DEFAULT_LANGUAGE,
                programId,
            });
            pendingFiles.delete(filename);
        }
    }
    (0, __1.deleteProgram)(programId);
    for (const reference of projectReferences) {
        await analyzeProgram(files, reference, results, pendingFiles);
    }
}
//# sourceMappingURL=analyzeWithProgram.js.map