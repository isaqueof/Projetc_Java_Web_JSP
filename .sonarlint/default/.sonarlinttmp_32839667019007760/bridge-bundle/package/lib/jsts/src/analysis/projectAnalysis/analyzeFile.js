"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFile = void 0;
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
const errors_1 = require("../../../../bridge/src/errors");
/**
 * Safely analyze a JavaScript/TypeScript file wrapping raised exceptions in the output format
 * @param input JsTsAnalysisInput object containing all the data necessary for the analysis
 */
function analyzeFile(input) {
    try {
        return (0, __1.analyzeJSTS)(input, input.language);
    }
    catch (e) {
        return (0, errors_1.parseParsingError)(e);
    }
}
exports.analyzeFile = analyzeFile;
//# sourceMappingURL=analyzeFile.js.map