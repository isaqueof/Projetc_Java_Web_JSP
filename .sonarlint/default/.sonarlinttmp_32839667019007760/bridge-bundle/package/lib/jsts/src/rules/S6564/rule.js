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
// https://sonarsource.github.io/rspec/#/rspec/S6564/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const COMMON_NODE_TYPES = new Set([
    'TSAnyKeyword',
    'TSBigIntKeyword',
    'TSBooleanKeyword',
    'TSNeverKeyword',
    'TSNullKeyword',
    'TSNumberKeyword',
    'TSStringKeyword',
    'TSSymbolKeyword',
    'TSUndefinedKeyword',
    'TSUnknownKeyword',
    'TSVoidKeyword',
]);
exports.rule = {
    meta: {
        messages: {
            redundantTypeAlias: 'Remove this redundant type alias and replace its occurrences with "{{type}}".',
        },
    },
    create(context) {
        return {
            TSTypeAliasDeclaration(node) {
                const { id, typeAnnotation } = node;
                if (COMMON_NODE_TYPES.has(typeAnnotation.type) || (0, helpers_1.isTypeAlias)(typeAnnotation, context)) {
                    const sourceCode = context.sourceCode;
                    const tpe = sourceCode.getTokens(typeAnnotation)[0];
                    context.report({
                        messageId: 'redundantTypeAlias',
                        node: id,
                        data: {
                            type: tpe.value,
                        },
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=rule.js.map