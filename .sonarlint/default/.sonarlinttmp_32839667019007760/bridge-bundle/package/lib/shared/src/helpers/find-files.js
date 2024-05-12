"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFiles = void 0;
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
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2023 SonarSource SA
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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shared_1 = require("@sonar/shared");
const minimatch_1 = require("minimatch");
// Patterns enforced to be ignored no matter what the user configures on sonar.properties
const IGNORED_PATTERNS = ['.scannerwork'];
/**
 * Traverse the directory tree recursively from `dir` and
 * gather files matching the `inclusionFilters`
 * that were not matching the `exclusionPatterns`.
 *
 * @param rawDir directory where the search starts
 * @param inclusionFilters glob patterns to search for, and parser function
 * @param exclusions glob patterns to ignore while walking the tree
 */
function searchFiles(rawDir, inclusionFilters, exclusions) {
    const dir = path_1.default.posix.normalize((0, shared_1.toUnixPath)(rawDir));
    const compiledInclusionFilters = compilePatterns(inclusionFilters);
    const exclusionPatterns = stringToGlob(exclusions.concat(IGNORED_PATTERNS));
    const result = {};
    for (const filterId of Object.keys(inclusionFilters)) {
        result[filterId] = {};
    }
    const dirs = [dir];
    while (dirs.length) {
        const dir = dirs.shift();
        for (const filterId of Object.keys(compiledInclusionFilters)) {
            result[filterId][dir] = [];
        }
        const files = fs_1.default.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            const filename = path_1.default.posix.join(dir, file.name);
            if (exclusionPatterns.some(pattern => pattern.match(filename))) {
                continue;
            }
            if (file.isDirectory()) {
                dirs.push(filename);
            }
            else {
                for (const [filterId, filter] of Object.entries(compiledInclusionFilters)) {
                    filterAndParse(filename, filter, result[filterId][dir]);
                }
            }
        }
    }
    return result;
}
exports.searchFiles = searchFiles;
function filterAndParse(filename, { patterns, parser }, db) {
    if (patterns.some(pattern => pattern.match(filename))) {
        (0, shared_1.debug)(`Found file: ${filename}`);
        if (!parser) {
            db.push({ filename, contents: undefined });
            return;
        }
        try {
            const contents = (0, shared_1.readFileSync)(filename);
            db.push({ filename, contents: parser(filename, contents) });
        }
        catch (e) {
            (0, shared_1.debug)(`Error parsing file ${filename}: ${e}`);
        }
    }
}
function stringToGlob(patterns) {
    return patterns.map(pattern => new minimatch_1.Minimatch(pattern, { nocase: true, matchBase: true }));
}
function compilePatterns(filters) {
    const compiledFilterMap = {};
    for (const [filterId, filter] of Object.entries(filters)) {
        compiledFilterMap[filterId] = {
            patterns: stringToGlob(filter.pattern.split(',')),
            parser: filter.parser,
        };
    }
    return compiledFilterMap;
}
//# sourceMappingURL=find-files.js.map