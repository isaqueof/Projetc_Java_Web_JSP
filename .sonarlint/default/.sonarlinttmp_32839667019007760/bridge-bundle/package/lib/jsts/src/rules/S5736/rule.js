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
// https://sonarsource.github.io/rspec/#/rspec/S5736/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const HELMET = 'helmet';
const POLICY = 'policy';
const REFERRER_POLICY = 'referrerPolicy';
const UNSAFE_REFERRER_POLICY_VALUES = ['', 'unsafe-url', 'no-referrer-when-downgrade'];
exports.rule = helpers_1.Express.SensitiveMiddlewarePropertyRule(findNoReferrerPolicyPropertyFromHelmet, `Make sure disabling strict HTTP no-referrer policy is safe here.`);
function findNoReferrerPolicyPropertyFromHelmet(context, node) {
    let sensitive;
    const { callee, arguments: args } = node;
    if (args.length === 1) {
        const [options] = args;
        /* helmet({ referrerPolicy: false }) or helmet.referrerPolicy({ policy: <unsafe_value> }) */
        const fqn = (0, helpers_1.getFullyQualifiedName)(context, callee);
        if (fqn === HELMET && options.type === 'ObjectExpression') {
            sensitive = (0, helpers_1.getPropertyWithValue)(context, options, REFERRER_POLICY, false);
        }
        else if (fqn === `${HELMET}.${REFERRER_POLICY}`) {
            const maybePolicy = (0, helpers_1.getObjectExpressionProperty)(options, POLICY);
            if (maybePolicy && !isSafePolicy(maybePolicy)) {
                sensitive = maybePolicy;
            }
        }
    }
    return sensitive ? [sensitive] : [];
}
function isSafePolicy(policy) {
    const { value } = policy;
    const values = value.type === 'ArrayExpression' ? value.elements : [value];
    const sensitiveValue = values.find(v => v?.type === 'Literal' &&
        typeof v.value === 'string' &&
        UNSAFE_REFERRER_POLICY_VALUES.includes(v.value));
    return !Boolean(sensitiveValue);
}
//# sourceMappingURL=rule.js.map