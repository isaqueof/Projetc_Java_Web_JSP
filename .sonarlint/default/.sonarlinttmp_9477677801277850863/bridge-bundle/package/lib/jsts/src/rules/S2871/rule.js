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
// https://sonarsource.github.io/rspec/#/rspec/S2871/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const compareNumberFunctionPlaceholder = '(a, b) => (a - b)';
const compareBigIntFunctionPlaceholder = [
    '(a, b) => {',
    '  if (a < b) {',
    '    return -1;',
    '  } else if (a > b) {',
    '    return 1;',
    '  } else {',
    '    return 0;',
    '  }',
    '}',
];
const languageSensitiveOrderPlaceholder = '(a, b) => a.localeCompare(b)';
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            provideCompareFunction: 'Provide a compare function to avoid sorting elements alphabetically.',
            provideCompareFunctionForArrayOfStrings: 'Provide a compare function that depends on "String.localeCompare", to reliably sort elements alphabetically.',
            suggestNumericOrder: 'Add a comparator function to sort in ascending order',
            suggestLanguageSensitiveOrder: 'Add a comparator function to sort in ascending language-sensitive order',
        },
    },
    create(context) {
        const sourceCode = context.sourceCode;
        const services = context.sourceCode.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            'CallExpression[arguments.length=0][callee.type="MemberExpression"]': (call) => {
                const { object, property: node } = call.callee;
                const text = sourceCode.getText(node);
                const type = (0, helpers_1.getTypeFromTreeNode)(object, services);
                if ([...helpers_1.sortLike, ...helpers_1.copyingSortLike].includes(text) && (0, helpers_1.isArrayLikeType)(type, services)) {
                    const suggest = getSuggestions(call, type);
                    const messageId = getMessageId(type);
                    context.report({ node, suggest, messageId });
                }
            },
        };
        function getSuggestions(call, type) {
            const suggestions = [];
            if ((0, helpers_1.isNumberArray)(type, services)) {
                suggestions.push({
                    messageId: 'suggestNumericOrder',
                    fix: fixer(call, compareNumberFunctionPlaceholder),
                });
            }
            else if ((0, helpers_1.isBigIntArray)(type, services)) {
                suggestions.push({
                    messageId: 'suggestNumericOrder',
                    fix: fixer(call, ...compareBigIntFunctionPlaceholder),
                });
            }
            else if ((0, helpers_1.isStringArray)(type, services)) {
                suggestions.push({
                    messageId: 'suggestLanguageSensitiveOrder',
                    fix: fixer(call, languageSensitiveOrderPlaceholder),
                });
            }
            return suggestions;
        }
        function getMessageId(type) {
            if ((0, helpers_1.isStringArray)(type, services)) {
                return 'provideCompareFunctionForArrayOfStrings';
            }
            return 'provideCompareFunction';
        }
        function fixer(call, ...placeholder) {
            const closingParenthesis = sourceCode.getLastToken(call, token => token.value === ')');
            const indent = ' '.repeat(call.loc?.start.column);
            const text = placeholder.join(`\n${indent}`);
            return fixer => fixer.insertTextBefore(closingParenthesis, text);
        }
    },
};
//# sourceMappingURL=rule.js.map