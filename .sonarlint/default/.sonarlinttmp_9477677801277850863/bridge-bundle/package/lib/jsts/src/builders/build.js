"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSourceCode = void 0;
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
const parsers_1 = require("../parsers");
const program_1 = require("../program");
/**
 * Builds an ESLint SourceCode for JavaScript / TypeScript
 *
 * This functions routes the parsing of the input based on the input language,
 * the file extension, and some contextual information.
 *
 * @param input the JavaScript / TypeScript analysis input
 * @param language the language of the input
 * @returns the parsed source code
 */
function buildSourceCode(input, language) {
    const vueFile = isVueFile(input.filePath);
    if (shouldUseTypescriptParser(language)) {
        const options = {
            // enable logs for @typescript-eslint
            // debugLevel: true,
            filePath: input.filePath,
            programs: input.programId && [(0, program_1.getProgramById)(input.programId)],
            project: input.tsConfigs,
            parser: vueFile ? parsers_1.parsers.typescript.parser : undefined,
        };
        const parser = vueFile ? parsers_1.parsers.vuejs : parsers_1.parsers.typescript;
        try {
            (0, shared_1.debug)(`Parsing ${input.filePath} with ${parser.parser}`);
            return (0, parsers_1.parseForESLint)(input.fileContent, parser.parse, (0, parsers_1.buildParserOptions)(options, false));
        }
        catch (error) {
            (0, shared_1.debug)(`Failed to parse ${input.filePath} with TypeScript parser: ${error.message}`);
            if (language === 'ts') {
                throw error;
            }
        }
    }
    let moduleError;
    try {
        const parser = vueFile ? parsers_1.parsers.vuejs : parsers_1.parsers.javascript;
        (0, shared_1.debug)(`Parsing ${input.filePath} with ${parser.parser}`);
        return (0, parsers_1.parseForESLint)(input.fileContent, parser.parse, (0, parsers_1.buildParserOptions)({ parser: vueFile ? parsers_1.parsers.javascript.parser : undefined }, true));
    }
    catch (error) {
        (0, shared_1.debug)(`Failed to parse ${input.filePath} with Javascript parser: ${error.message}`);
        if (vueFile) {
            throw error;
        }
        moduleError = error;
    }
    try {
        (0, shared_1.debug)(`Parsing ${input.filePath} with Javascript parser in 'script' mode`);
        return (0, parsers_1.parseForESLint)(input.fileContent, parsers_1.parsers.javascript.parse, (0, parsers_1.buildParserOptions)({ sourceType: 'script' }, true));
    }
    catch (error) {
        (0, shared_1.debug)(`Failed to parse ${input.filePath} with Javascript parser in 'script' mode: ${error.message}`);
        /**
         * We prefer displaying parsing error as module if parsing as script also failed,
         * as it is more likely that the expected source type is module.
         */
        throw moduleError;
    }
}
exports.buildSourceCode = buildSourceCode;
function shouldUseTypescriptParser(language) {
    return (0, shared_1.getContext)()?.shouldUseTypeScriptParserForJS !== false || language === 'ts';
}
function isVueFile(file) {
    return file.toLowerCase().endsWith('.vue');
}
//# sourceMappingURL=build.js.map