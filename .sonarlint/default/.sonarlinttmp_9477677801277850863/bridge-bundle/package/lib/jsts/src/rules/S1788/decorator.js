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
// https://sonarsource.github.io/rspec/#/rspec/S1788/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
const NUM_ARGS_REDUX_REDUCER = 2;
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(isReduxReducer));
}
exports.decorate = decorate;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const node = reportDescriptor['node'];
            const scope = context.getScope();
            const variable = scope.variables.find(value => (0, helpers_1.isIdentifier)(node.left, value.name));
            const enclosingFunction = variable?.defs?.[0]?.node;
            if (enclosingFunction && !exemptionCondition(enclosingFunction)) {
                context.report(reportDescriptor);
            }
        }
    };
}
function isReduxReducer(enclosingFunction) {
    if (enclosingFunction.params.length === NUM_ARGS_REDUX_REDUCER) {
        const [firstParam, secondParam] = enclosingFunction.params;
        return (firstParam.type === 'AssignmentPattern' &&
            (0, helpers_1.isIdentifier)(firstParam.left, 'state') &&
            (0, helpers_1.isIdentifier)(secondParam, 'action'));
    }
    return false;
}
//# sourceMappingURL=decorator.js.map