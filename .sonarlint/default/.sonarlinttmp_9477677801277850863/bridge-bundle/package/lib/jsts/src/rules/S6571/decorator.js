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
// https://sonarsource.github.io/rspec/#/rspec/S6571/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting);
}
exports.decorate = decorate;
function reportExempting(context, descriptor) {
    if ('node' in descriptor) {
        const { node, ...rest } = descriptor;
        if (exemptionCondition(node, descriptor)) {
            return;
        }
        context.report({ node, ...rest });
    }
}
// We ignore issues where typeName is 'any' but not raised for the 'any' keyword as they are due to unresolved types.
// The same exception applies for the 'unknown' type.
function exemptionCondition(node, descriptor) {
    const data = descriptor.data;
    return ((data?.['typeName'] === 'any' && node.type !== 'TSAnyKeyword') ||
        (data?.['typeName'] === 'unknown' && node.type !== 'TSUnknownKeyword'));
}
//# sourceMappingURL=decorator.js.map