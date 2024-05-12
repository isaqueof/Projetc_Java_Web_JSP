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
// https://sonarsource.github.io/rspec/#/rspec/S1534/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
// core implementation of ESLint 'no-dupe-keys' does not provide quick fixes
function decorate(rule) {
    rule.meta.hasSuggestions = true;
    return (0, helpers_1.interceptReport)(rule, (context, reportDescriptor) => {
        context.report({
            ...reportDescriptor,
            suggest: [
                {
                    desc: 'Remove this duplicate property',
                    fix(fixer) {
                        const propertyToRemove = getPropertyNode(reportDescriptor, context);
                        const commaAfter = context.sourceCode.getTokenAfter(propertyToRemove, token => token.value === ',');
                        const commaBefore = context.sourceCode.getTokenBefore(propertyToRemove, token => token.value === ',');
                        let start = commaBefore.range[1];
                        let end = propertyToRemove.range[1];
                        if (commaAfter) {
                            end = commaAfter.range[1];
                        }
                        else {
                            start = commaBefore.range[0];
                        }
                        return fixer.removeRange([start, end]);
                    },
                },
            ],
        });
    });
}
exports.decorate = decorate;
function getPropertyNode(reportDescriptor, context) {
    if ('node' in reportDescriptor && 'loc' in reportDescriptor) {
        const objectLiteral = reportDescriptor['node'];
        const loc = reportDescriptor['loc'];
        const transformPosToIndex = (p) => context.sourceCode.getIndexFromLoc(p);
        return objectLiteral.properties.find(property => transformPosToIndex(property.loc?.start) <= transformPosToIndex(loc?.start) &&
            transformPosToIndex(property.loc?.end) >= transformPosToIndex(loc?.end));
    }
    else {
        throw new Error('Missing properties in report descriptor for rule S1534');
    }
}
//# sourceMappingURL=decorator.js.map