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
// https://sonarsource.github.io/rspec/#/rspec/S6304/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const result_1 = require("../helpers/result");
const iam_1 = require("../helpers/aws/iam");
const MESSAGES = {
    message: 'Make sure granting access to all resources is safe here.',
    secondary: 'Related effect',
};
const KMS_PREFIX = 'kms:';
exports.rule = (0, iam_1.AwsIamPolicyTemplate)(allResourcesAccessibleStatementCheck);
function allResourcesAccessibleStatementCheck(expr, ctx, options) {
    const properties = (0, result_1.getResultOfExpression)(ctx, expr);
    const effect = (0, iam_1.getSensitiveEffect)(properties, ctx, options);
    const resource = getSensitiveResource(properties, options);
    if (isException(properties, options)) {
        return;
    }
    if (effect.isMissing && resource) {
        ctx.report({
            message: (0, helpers_1.toEncodedMessage)(MESSAGES.message),
            node: resource,
        });
    }
    else if (effect.isFound && resource) {
        ctx.report({
            message: (0, helpers_1.toEncodedMessage)(MESSAGES.message, [effect.node], [MESSAGES.secondary]),
            node: resource,
        });
    }
}
function isException(properties, options) {
    return properties.getProperty(options.actions.property).everyStringLiteral(isKmsAction);
}
function isKmsAction(action) {
    return action.value.startsWith(KMS_PREFIX);
}
function getSensitiveResource(properties, options) {
    return getSensitiveResources(properties, options).find(iam_1.isAnyLiteral);
}
function getSensitiveResources(properties, options) {
    return properties.getProperty(options.resources.property).asStringLiterals();
}
//# sourceMappingURL=rule.js.map