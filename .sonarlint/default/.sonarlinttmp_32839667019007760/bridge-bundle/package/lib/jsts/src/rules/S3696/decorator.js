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
// https://sonarsource.github.io/rspec/#/rspec/S3696/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
// core implementation of this rule does not provide quick fixes
function decorate(rule) {
    rule.meta.hasSuggestions = true;
    return (0, helpers_1.interceptReport)(rule, (context, reportDescriptor) => {
        const suggest = [];
        if ('node' in reportDescriptor) {
            const { argument: thrown } = reportDescriptor.node;
            if (isStringLike(thrown)) {
                const thrownText = context.sourceCode.getText(thrown);
                suggest.push({
                    desc: 'Throw an error object',
                    fix: fixer => fixer.replaceText(thrown, `new Error(${thrownText})`),
                });
            }
        }
        context.report({
            ...reportDescriptor,
            suggest,
        });
    });
}
exports.decorate = decorate;
function isStringLike(node) {
    return (0, helpers_1.isStringLiteral)(node) || isStringConcatenation(node);
}
function isStringConcatenation(node) {
    return (0, helpers_1.isBinaryPlus)(node) && (isStringLike(node.left) || isStringLike(node.right));
}
//# sourceMappingURL=decorator.js.map