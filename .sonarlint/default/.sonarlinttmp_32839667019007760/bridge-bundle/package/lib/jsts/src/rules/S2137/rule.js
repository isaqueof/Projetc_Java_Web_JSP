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
// https://sonarsource.github.io/rspec/#/rspec/S2137/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const illegalNames = ['arguments'];
const objectPrototypeProperties = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf',
];
const deprecatedNames = ['escape', 'unescape'];
const getDeclarationIssue = (redeclareType) => (name) => ({
    messageId: 'forbidDeclaration',
    data: { symbol: name, type: redeclareType },
});
const getModificationIssue = (functionName) => ({
    messageId: 'removeModification',
    data: { symbol: functionName },
});
exports.rule = {
    meta: {
        messages: {
            removeModification: 'Remove the modification of "{{symbol}}".',
            forbidDeclaration: 'Do not use "{{symbol}}" to declare a {{type}} - use another name.',
        },
    },
    create(context) {
        return {
            'FunctionDeclaration, FunctionExpression'(node) {
                const func = node;
                reportBadUsageOnFunction(func, func.id, context);
            },
            ArrowFunctionExpression(node) {
                reportBadUsageOnFunction(node, undefined, context);
            },
            VariableDeclaration(node) {
                node.declarations.forEach(decl => {
                    reportGlobalShadowing(decl.id, getDeclarationIssue('variable'), context, decl.init != null);
                });
            },
            UpdateExpression(node) {
                reportGlobalShadowing(node.argument, getModificationIssue, context, true);
            },
            AssignmentExpression(node) {
                reportGlobalShadowing(node.left, getModificationIssue, context, true);
            },
            CatchClause(node) {
                reportGlobalShadowing(node.param, getDeclarationIssue('variable'), context, true);
            },
        };
    },
};
function reportBadUsageOnFunction(func, id, context) {
    reportGlobalShadowing(id, getDeclarationIssue('function'), context, true);
    func.params.forEach(p => {
        reportGlobalShadowing(p, getDeclarationIssue('parameter'), context, false);
    });
}
function reportGlobalShadowing(node, buildMessageAndData, context, isWrite) {
    if (node) {
        switch (node.type) {
            case 'Identifier': {
                if (isGlobalShadowing(node.name, isWrite) && !isShadowingException(node.name)) {
                    context.report({
                        node,
                        ...buildMessageAndData(node.name),
                    });
                }
                break;
            }
            case 'RestElement':
                reportGlobalShadowing(node.argument, buildMessageAndData, context, true);
                break;
            case 'ObjectPattern':
                node.properties.forEach(prop => {
                    if (prop.type === 'Property') {
                        reportGlobalShadowing(prop.value, buildMessageAndData, context, true);
                    }
                    else {
                        reportGlobalShadowing(prop.argument, buildMessageAndData, context, true);
                    }
                });
                break;
            case 'ArrayPattern':
                node.elements.forEach(elem => {
                    reportGlobalShadowing(elem, buildMessageAndData, context, true);
                });
                break;
            case 'AssignmentPattern':
                reportGlobalShadowing(node.left, buildMessageAndData, context, true);
                break;
        }
    }
}
function isGlobalShadowing(name, isWrite) {
    return isIllegalName(name) || isBuiltInName(name) || isUndefinedShadowing(isWrite, name);
}
function isIllegalName(name) {
    return illegalNames.includes(name);
}
function isBuiltInName(name) {
    return helpers_1.globalsByLibraries.builtin.includes(name);
}
function isUndefinedShadowing(isWrite, name) {
    return isWrite && name === 'undefined';
}
function isShadowingException(name) {
    return isObjectPrototypeProperty(name) || isDeprecatedName(name);
}
function isObjectPrototypeProperty(name) {
    return objectPrototypeProperties.includes(name);
}
function isDeprecatedName(name) {
    return deprecatedNames.includes(name);
}
//# sourceMappingURL=rule.js.map