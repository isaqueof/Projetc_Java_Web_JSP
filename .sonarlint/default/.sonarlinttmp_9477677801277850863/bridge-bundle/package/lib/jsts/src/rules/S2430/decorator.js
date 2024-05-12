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
// https://sonarsource.github.io/rspec/#/rspec/S2430/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(isNotClassOrFunction));
}
exports.decorate = decorate;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const node = reportDescriptor['node'];
            if (!exemptionCondition(context, node)) {
                context.report(reportDescriptor);
            }
        }
    };
}
function isNotClassOrFunction(context, node) {
    const callee = node.callee;
    if (callee.type !== 'Identifier') {
        return false;
    }
    const variable = (0, helpers_1.getVariableFromName)(context, callee.name);
    if (variable) {
        for (const def of variable.defs) {
            if (!(def.type === 'ClassName' || def.type === 'FunctionName')) {
                return true;
            }
        }
    }
    return false;
}
//# sourceMappingURL=decorator.js.map