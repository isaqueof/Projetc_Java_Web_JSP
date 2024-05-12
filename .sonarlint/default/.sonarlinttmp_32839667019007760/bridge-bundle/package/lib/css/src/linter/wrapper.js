"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linter = exports.LinterWrapper = void 0;
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
const stylelint = __importStar(require("stylelint"));
const issues_1 = require("./issues");
const rules_1 = require("../rules");
/**
 * A wrapper of Stylelint linter
 */
class LinterWrapper {
    /**
     * Constructs a Stylelint wrapper
     */
    constructor() {
        this.defineRules();
    }
    /**
     * Lints a stylesheet
     *
     * Linting a stylesheet implies using Stylelint linting functionality to find
     * problems in the sheet. It does not need to be provided with an abstract
     * syntax tree as Stylelint takes care of the parsing internally.
     *
     * The result of linting a stylesheet requires post-linting transformations
     * to return SonarQube issues. These transformations essentially consist in
     * transforming Stylelint results into SonarQube issues.
     *
     * Because stylesheets are far different from what a source code is, metrics
     * computation does not make sense when analyzing such file contents. Issues
     * only are returned after linting.
     *
     * @param filePath the path of the stylesheet
     * @param options the linting options
     * @returns the found issues
     */
    lint(filePath, options) {
        return stylelint
            .lint(options)
            .then(result => ({ issues: (0, issues_1.transform)(result.results, filePath) }));
    }
    /**
     * Defines the wrapper's rules
     *
     * Besides Stylelint rules, the linter wrapper includes all the rules that
     * are implemented internally.
     */
    defineRules() {
        for (const key in rules_1.rules) {
            stylelint.rules[key] = rules_1.rules[key];
        }
    }
}
exports.LinterWrapper = LinterWrapper;
/**
 * The global Stylelint linter wrapper
 */
exports.linter = new LinterWrapper();
//# sourceMappingURL=wrapper.js.map