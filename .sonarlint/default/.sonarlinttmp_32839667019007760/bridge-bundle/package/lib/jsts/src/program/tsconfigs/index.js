"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTSConfigsIterator = exports.setTSConfigs = exports.getTSConfigsCount = exports.clearTSConfigs = exports.loadTSConfigs = exports.TSCONFIG_JSON = void 0;
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
const program_1 = require("../program");
const analysis_1 = require("../../analysis");
exports.TSCONFIG_JSON = 'tsconfig.json';
// Would need to parse jsonc (different spec from json, using jsonc-parser from Microsoft)
//import { TsConfigJson } from 'type-fest';
let TSConfigJsonsByBaseDir;
function loadTSConfigs(baseDir, exclusions) {
    const { tsConfigs } = (0, shared_1.searchFiles)(baseDir, { tsConfigs: { pattern: exports.TSCONFIG_JSON } }, exclusions);
    TSConfigJsonsByBaseDir = tsConfigs;
}
exports.loadTSConfigs = loadTSConfigs;
function clearTSConfigs() {
    TSConfigJsonsByBaseDir = {};
}
exports.clearTSConfigs = clearTSConfigs;
function getTSConfigsCount() {
    let count = 0;
    for (const tsConfigs of Object.values(TSConfigJsonsByBaseDir)) {
        count += tsConfigs.length;
    }
    return count;
}
exports.getTSConfigsCount = getTSConfigsCount;
function setTSConfigs(db) {
    TSConfigJsonsByBaseDir = db;
}
exports.setTSConfigs = setTSConfigs;
async function* getTSConfigsIterator(files, baseDir, sonarLint, maxFilesForTypeChecking) {
    let emptyTsConfigs = true;
    if (TSConfigJsonsByBaseDir) {
        for (const tsconfigs of Object.values(TSConfigJsonsByBaseDir)) {
            for (const { filename: tsConfig } of tsconfigs) {
                emptyTsConfigs = false;
                yield tsConfig;
            }
        }
    }
    const maxFiles = typeof maxFilesForTypeChecking === 'undefined'
        ? analysis_1.DEFAULT_MAX_FILES_FOR_TYPE_CHECKING
        : maxFilesForTypeChecking;
    if (emptyTsConfigs && files.length < maxFiles) {
        const tsConfig = sonarLint
            ? (0, program_1.createTSConfigFile)(undefined, [baseDir + '/**/*'])
            : (0, program_1.createTSConfigFile)(files);
        const { filename } = await (0, program_1.writeTSConfigFile)(tsConfig);
        yield filename;
    }
}
exports.getTSConfigsIterator = getTSConfigsIterator;
//# sourceMappingURL=index.js.map