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
// https://sonarsource.github.io/rspec/#/rspec/S6486/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
exports.rule = {
    meta: {
        messages: {
            noGeneratedKeys: 'Do not use generated values for keys of React list components.',
        },
    },
    create(context) {
        return {
            "JSXAttribute[name.name='key']": (pNode) => {
                // hack: it's not possible to type the argument node from TSESTree
                const node = pNode;
                const value = node.value;
                if (!value || value.type !== 'JSXExpressionContainer') {
                    // key='foo' or just simply 'key'
                    return;
                }
                checkPropValue(context, value.expression);
            },
        };
    },
};
function checkPropValue(context, node) {
    if (isGeneratedExpression(node)) {
        // key={bar}
        context.report({
            messageId: 'noGeneratedKeys',
            node: node,
        });
        return;
    }
    if (node.type === 'TemplateLiteral') {
        // key={`foo-${bar}`}
        node.expressions.filter(isGeneratedExpression).forEach(() => {
            context.report({
                messageId: 'noGeneratedKeys',
                node: node,
            });
        });
        return;
    }
    if (node.type === 'BinaryExpression') {
        // key={'foo' + bar}
        const callExpressions = getCallExpressionsFromBinaryExpression(node);
        callExpressions.filter(isGeneratedExpression).forEach(() => {
            context.report({
                messageId: 'noGeneratedKeys',
                node: node,
            });
        });
        return;
    }
    if (node.type === 'CallExpression' &&
        node.callee &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object &&
        isGeneratedExpression(node.callee.object) &&
        node.callee.property &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'toString') {
        // key={bar.toString()}
        context.report({
            messageId: 'noGeneratedKeys',
            node: node,
        });
        return;
    }
    if (node.type === 'CallExpression' &&
        node.callee &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'String' &&
        Array.isArray(node.arguments) &&
        node.arguments.length > 0 &&
        isGeneratedExpression(node.arguments[0])) {
        // key={String(bar)}
        context.report({
            messageId: 'noGeneratedKeys',
            node: node.arguments[0],
        });
    }
}
function isGeneratedExpression(node) {
    return isMathRandom(node) || isDateNow(node);
    function isMathRandom(node) {
        return (node.type === 'CallExpression' &&
            (0, helpers_1.isMemberExpression)(node.callee, 'Math', 'random'));
    }
    function isDateNow(node) {
        return (node.type === 'CallExpression' &&
            (0, helpers_1.isMemberExpression)(node.callee, 'Date', 'now'));
    }
}
function getCallExpressionsFromBinaryExpression(side) {
    if (side.type === 'CallExpression') {
        return side;
    }
    if (side.type === 'BinaryExpression') {
        // recurse
        const left = getCallExpressionsFromBinaryExpression(side.left);
        const right = getCallExpressionsFromBinaryExpression(side.right);
        return [].concat(left, right).filter(Boolean);
    }
    return null;
}
//# sourceMappingURL=rule.js.map