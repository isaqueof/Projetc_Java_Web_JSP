"use strict";
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
// https://sonarsource.github.io/rspec/#/rspec/S125/css
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
exports.rule = void 0;
const stylelint = __importStar(require("stylelint"));
const postcss_1 = require("postcss");
const ruleName = 'no-commented-code';
const messages = { commentedCode: 'Remove this commented out code.' };
const ruleImpl = () => {
    return (root, result) => {
        root.walkComments((comment) => {
            const { text } = comment;
            if (isLikelyCss(text)) {
                try {
                    (0, postcss_1.parse)(text);
                    stylelint.utils.report({
                        ruleName,
                        result,
                        message: messages.commentedCode,
                        node: comment,
                    });
                }
                catch {
                    /* syntax error */
                }
            }
        });
    };
    function isLikelyCss(text) {
        // Regular expression to match CSS selectors, properties, and values
        // `<selector(s)> '{' <anything> '}'`
        const ruleRegex = /([a-z0-9\s,.\-#:_]+)\{([^}]*)\}/i;
        // Regular expression to match CSS declarations
        // `<property> ':' <value> ';'`
        const declRegex = /([a-z-]+)\s*:\s*([^;]+);/i;
        // Regular expression to match CSS at-rules
        // `'@' <at-rule> '(' <anything> ')'`
        const atRuleRegex = /@([a-z-]*)\s*([^;{]*)(;|(\{([^}]*)\}))/i;
        // Test the text against the regular expressions
        return ruleRegex.test(text) || declRegex.test(text) || atRuleRegex.test(text);
    }
};
exports.rule = stylelint.createPlugin(ruleName, Object.assign(ruleImpl, {
    messages,
    ruleName,
}));
//# sourceMappingURL=rule.js.map