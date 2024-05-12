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
// https://sonarsource.github.io/rspec/#/rspec/S6572/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
// The core implementation of this rule reports all enums for which there is a member value that is
// not initialized explicitly. Here, the decorator's purpose is to restrict the scope of the rule only
// to enums that already initialize a subset of members and leave the remaining ones uninitialized, with
// the exception of those that enforce a numerical order by assigning a literal to the first member value.
// In other words, the decorated rule ignores enums that don't initialize any member value or those
// that initialize their first member with a number literal.
function decorate(rule) {
    rule.meta.hasSuggestions = true;
    return (0, helpers_1.interceptReport)(rule, (context, descriptor) => {
        const enumMember = descriptor.node;
        const enumDecl = enumMember.parent;
        if (anyInitialized(enumDecl) && !numericalOrder(enumDecl)) {
            context.report(descriptor);
        }
    });
}
exports.decorate = decorate;
function anyInitialized(enumDecl) {
    return enumDecl.members.some(m => m.initializer !== undefined);
}
function numericalOrder(enumDecl) {
    const firstMember = enumDecl.members[0];
    const membersRest = enumDecl.members.slice(1);
    return (firstMember.initializer?.type === 'Literal' &&
        (0, helpers_1.isNumberLiteral)(firstMember.initializer) &&
        membersRest.every(m => m.initializer === undefined));
}
//# sourceMappingURL=decorator.js.map