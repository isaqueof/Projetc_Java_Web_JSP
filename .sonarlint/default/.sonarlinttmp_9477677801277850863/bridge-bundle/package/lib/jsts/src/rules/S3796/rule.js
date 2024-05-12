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
// https://sonarsource.github.io/rspec/#/rspec/S3796/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const helpers_1 = require("../helpers");
const message = `Add a "return" statement to this callback.`;
const methodsWithCallback = [
    'every',
    'filter',
    'find',
    'findLast',
    'findIndex',
    'findLastIndex',
    'map',
    'flatMap',
    'reduce',
    'reduceRight',
    'some',
    'sort',
    'toSorted',
];
function hasCallBackWithoutReturn(argument, services) {
    const checker = services.program.getTypeChecker();
    const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(argument));
    const signatures = type.getCallSignatures();
    return (signatures.length > 0 &&
        signatures.every(sig => checker.typeToString(sig.getReturnType()) === 'void'));
}
exports.rule = {
    create(context) {
        const services = context.sourceCode.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            'CallExpression[callee.type="MemberExpression"]'(node) {
                const callExpression = node;
                const args = callExpression.arguments;
                const memberExpression = callExpression.callee;
                const { object } = memberExpression;
                const propName = extractPropName(memberExpression);
                if (propName === null || args.length === 0) {
                    return;
                }
                if (methodsWithCallback.includes(propName) &&
                    ((0, helpers_1.isArray)(object, services) || (0, helpers_1.isTypedArray)(object, services)) &&
                    hasCallBackWithoutReturn(args[0], services)) {
                    context.report({
                        message,
                        ...getNodeToReport(args[0], node, context),
                    });
                }
                else if ((0, helpers_1.isMemberExpression)(callExpression.callee, 'Array', 'from') &&
                    args.length > 1 &&
                    hasCallBackWithoutReturn(args[1], services)) {
                    context.report({
                        message,
                        ...getNodeToReport(args[1], node, context),
                    });
                }
            },
        };
    },
};
function extractPropName(memberExpression) {
    if ((0, helpers_1.isDotNotation)(memberExpression)) {
        return memberExpression.property.name;
    }
    else if ((0, helpers_1.isIndexNotation)(memberExpression)) {
        return memberExpression.property.value;
    }
    else {
        return null;
    }
}
function getNodeToReport(node, parent, context) {
    if (node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression') {
        return {
            loc: (0, locations_1.getMainFunctionTokenLocation)(node, parent, context),
        };
    }
    return {
        node,
    };
}
//# sourceMappingURL=rule.js.map