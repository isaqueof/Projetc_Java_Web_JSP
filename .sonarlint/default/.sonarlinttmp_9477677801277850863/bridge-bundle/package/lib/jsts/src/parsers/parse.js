"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseForESLint = void 0;
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
const eslint_1 = require("eslint");
/**
 * Parses a JavaScript / TypeScript analysis input with an ESLint-based parser
 * @param code the JavaScript / TypeScript code to parse
 * @param parse the ESLint parsing function to use for parsing
 * @param options the ESLint parser options
 * @returns the parsed source code
 */
function parseForESLint(code, parse, options) {
    try {
        const result = parse(code, options);
        const parserServices = result.services || {};
        return new eslint_1.SourceCode({
            ...result,
            text: code,
            parserServices,
        });
    }
    catch ({ lineNumber, message }) {
        if (message.startsWith('Debug Failure')) {
            throw shared_1.APIError.failingTypeScriptError(message);
        }
        else {
            throw shared_1.APIError.parsingError(message, { line: lineNumber });
        }
    }
}
exports.parseForESLint = parseForESLint;
//# sourceMappingURL=parse.js.map