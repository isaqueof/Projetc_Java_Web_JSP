"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeWithoutProgram = void 0;
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
 * Analyzes JavaScript / TypeScript files without type-checking.
 *
 * @param filenames the list of JavaScript / TypeScript files to analyze.
 * @param files the list of JavaScript / TypeScript files objects containing the files input data.
 * @param results ProjectAnalysisOutput object where the analysis results are stored
 */
async function analyzeWithoutProgram(filenames, files, results) {
    for (const filename of filenames) {
        results.meta?.filesWithoutTypeChecking.push(filename);
        results.files[filename] = (0, __1.analyzeFile)({
            filePath: filename,
            fileContent: files[filename].fileContent ?? (await (0, shared_1.readFile)(filename)),
            fileType: files[filename].fileType,
            language: files[filename].language ?? __1.DEFAULT_LANGUAGE,
        });
    }
}
exports.analyzeWithoutProgram = analyzeWithoutProgram;
//# sourceMappingURL=analyzeWithoutProgram.js.map