"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCSS = void 0;
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
const linter_1 = require("../linter");
/**
 * Analyzes a CSS analysis input
 *
 * Analyzing a CSS analysis input is rather straighforward. All that is needed
 * is to create a Stylelint configuration based on the rules from the active
 * quality profile and uses this configuration to linter the input file.
 *
 * @param input the CSS analysis input to analyze
 * @returns a promise of the CSS analysis output
 */
async function analyzeCSS(input) {
    const { filePath, fileContent: code, rules } = input;
    const config = (0, linter_1.createStylelintConfig)(rules);
    const options = {
        code,
        codeFilename: filePath,
        config,
    };
    return linter_1.linter.lint(filePath, options);
}
exports.analyzeCSS = analyzeCSS;
//# sourceMappingURL=analyzer.js.map