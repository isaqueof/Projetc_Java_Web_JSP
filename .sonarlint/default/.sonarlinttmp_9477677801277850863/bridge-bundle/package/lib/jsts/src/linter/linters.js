"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinter = exports.initializeLinter = void 0;
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
const wrapper_1 = require("./wrapper");
/**
 * The global ESLint linters
 *
 * Any linter is expected to be initialized before use.
 * To this end, the plugin is expected to explicitly send a request to
 * initialize a linter before starting the actual analysis of a file.
 * The global linters object will keep the already initialized linters
 * indexed by their linterId. If no linterId is provided, `default` will
 * be used.
 * Having multiple linters (each with different set of rules enabled)
 * is needed in order to not run all rules on 'unchanged' files
 */
const linters = {};
/**
 * Initializes the global linter wrapper
 * @param inputRules the rules from the active quality profiles
 * @param environments the JavaScript execution environments
 * @param globals the global variables
 * @param linterId key of the linter
 */
function initializeLinter(inputRules, environments = [], globals = [], linterId = 'default') {
    (0, shared_1.debug)(`Initializing linter "${linterId}" with ${inputRules.map(rule => rule.key)}`);
    linters[linterId] = new wrapper_1.LinterWrapper({ inputRules, environments, globals });
}
exports.initializeLinter = initializeLinter;
/**
 * Returns the linter with the given ID
 *
 * @param linterId key of the linter
 *
 * Throws a runtime error if the global linter wrapper is not initialized.
 */
function getLinter(linterId = 'default') {
    if (!linters[linterId]) {
        throw shared_1.APIError.linterError(`Linter ${linterId} does not exist. Did you call /init-linter?`);
    }
    return linters[linterId];
}
exports.getLinter = getLinter;
//# sourceMappingURL=linters.js.map