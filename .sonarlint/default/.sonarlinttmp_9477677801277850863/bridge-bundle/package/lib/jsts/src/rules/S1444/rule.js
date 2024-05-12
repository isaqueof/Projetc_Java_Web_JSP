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
// https://sonarsource.github.io/rspec/#/rspec/S1444/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            message: `Make this public static property readonly.`,
            fix: 'Add "readonly" keyword',
        },
    },
    create(context) {
        return {
            'PropertyDefinition[readonly!=true][static=true][accessibility!="private"][accessibility!="protected"]'(node) {
                context.report({
                    messageId: 'message',
                    node: node.key,
                    suggest: [
                        {
                            fix: fixer => {
                                const tokens = context.sourceCode.getTokens(node);
                                const staticToken = tokens.find(t => t.value === 'static');
                                return fixer.insertTextAfter(staticToken, ' readonly');
                            },
                            messageId: 'fix',
                        },
                    ],
                });
            },
        };
    },
};
//# sourceMappingURL=rule.js.map