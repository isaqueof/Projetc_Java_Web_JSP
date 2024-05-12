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
// https://sonarsource.github.io/rspec/#/rspec/S6270/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const result_1 = require("../helpers/result");
const iam_1 = require("../helpers/aws/iam");
const cdk_1 = require("../helpers/aws/cdk");
const AWS_PRINCIPAL_PROPERTY = 'AWS';
const ARN_PRINCIPAL = 'aws_cdk_lib.aws_iam.ArnPrincipal';
const MESSAGES = {
    message: 'Make sure granting public access is safe here.',
    secondary: 'Related effect',
};
exports.rule = (0, iam_1.AwsIamPolicyTemplate)(publicAccessStatementChecker);
function publicAccessStatementChecker(expr, ctx, options) {
    const properties = (0, result_1.getResultOfExpression)(ctx, expr);
    const effect = (0, iam_1.getSensitiveEffect)(properties, ctx, options);
    const principal = getSensitivePrincipal(properties, ctx, options);
    if (effect.isMissing && principal) {
        ctx.report({
            message: (0, helpers_1.toEncodedMessage)(MESSAGES.message),
            node: principal,
        });
    }
    else if (effect.isFound && principal) {
        ctx.report({
            message: (0, helpers_1.toEncodedMessage)(MESSAGES.message, [effect.node], [MESSAGES.secondary]),
            node: principal,
        });
    }
}
function getSensitivePrincipal(properties, ctx, options) {
    const principal = properties.getProperty(options.principals.property);
    if (!principal.isFound) {
        return null;
    }
    else if (options.principals.type === 'FullyQualifiedName') {
        return getSensitivePrincipalFromFullyQualifiedName(ctx, principal.node, options);
    }
    else {
        return getSensitivePrincipalFromJson(ctx, principal.node);
    }
}
function getSensitivePrincipalFromFullyQualifiedName(ctx, node, options) {
    return getPrincipalNewExpressions(node).find(expr => isSensitivePrincipalNewExpression(ctx, expr, options));
}
function getPrincipalNewExpressions(node) {
    const newExpressions = [];
    if ((0, helpers_1.isArrayExpression)(node)) {
        for (const element of node.elements) {
            if (element?.type === 'NewExpression') {
                newExpressions.push(element);
            }
        }
    }
    return newExpressions;
}
function getSensitivePrincipalFromJson(ctx, node) {
    return getPrincipalLiterals(node, ctx).find(iam_1.isAnyLiteral);
}
function isSensitivePrincipalNewExpression(ctx, newExpression, options) {
    return (options.principals.anyValues ?? []).some(anyValue => {
        if (anyValue === ARN_PRINCIPAL) {
            const argument = newExpression.arguments[0];
            return (0, helpers_1.isStringLiteral)(argument) && (0, iam_1.isAnyLiteral)(argument);
        }
        else {
            return anyValue === (0, cdk_1.normalizeFQN)((0, helpers_1.getFullyQualifiedName)(ctx, newExpression.callee));
        }
    });
}
function getPrincipalLiterals(node, ctx) {
    const literals = [];
    if ((0, helpers_1.isStringLiteral)(node)) {
        literals.push(node);
    }
    else {
        const awsLiterals = (0, result_1.getResultOfExpression)(ctx, node)
            .getProperty(AWS_PRINCIPAL_PROPERTY)
            .asStringLiterals();
        literals.push(...awsLiterals);
    }
    return literals;
}
//# sourceMappingURL=rule.js.map