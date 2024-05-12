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
// https://sonarsource.github.io/rspec/#/rspec/S5973/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const jsts_1 = require("@sonar/jsts");
exports.rule = {
    meta: {
        messages: {
            stable: 'Make your tests stable so that they pass on the first try, or remove the flaky ones.',
        },
    },
    create(context) {
        const describes = [];
        const hasJest = hasJestDependency(context);
        return {
            /**
             * We use the stack approach to check for Mocha retries inside describe blocks,
             * and implicitly test cases.
             */
            CallExpression(node) {
                if (hasJestRetry(context, node, hasJest)) {
                    report(context, node);
                    return;
                }
                if (helpers_1.Mocha.isDescribeCase(node)) {
                    describes.push(node);
                    return;
                }
                if (describes.length > 0) {
                    checkMochaRetries(context, node);
                }
            },
            'CallExpression:exit': (node) => {
                if (helpers_1.Mocha.isDescribeCase(node)) {
                    describes.pop();
                }
            },
            'Program:exit': () => {
                describes.length = 0;
            },
        };
    },
};
function hasJestRetry(context, node, hasJest) {
    const callExpressionName = (0, helpers_1.getFullyQualifiedName)(context, node);
    return (callExpressionName === 'jest.retryTimes' ||
        (hasJest && (0, helpers_1.isMethodInvocation)(node, 'jest', 'retryTimes', 1)));
}
function hasJestDependency(context) {
    const dependencies = (0, jsts_1.getDependencies)(context.filename);
    return dependencies.has('jest');
}
/**
 * Flag if `this.retries()`
 */
function checkMochaRetries(context, node) {
    const callee = node.callee;
    if (callee.type === 'MemberExpression' &&
        callee.object.type === 'ThisExpression' &&
        (0, helpers_1.isIdentifier)(callee.property, 'retries')) {
        report(context, node);
    }
}
function report(context, node) {
    context.report({
        messageId: 'stable',
        node,
    });
}
//# sourceMappingURL=rule.js.map