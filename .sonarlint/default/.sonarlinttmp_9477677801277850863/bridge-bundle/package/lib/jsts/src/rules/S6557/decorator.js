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
// https://sonarsource.github.io/rspec/#/rspec/S6557/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
// Core implementation of this rule does not provide a message for quick fixes. Normally, we would
// just map the rule id to a message in src/linter/quickfixes/messages.ts. However,
// here we need a different message per method, that is, String#startsWith and String#endsWith.
function decorate(rule) {
    rule.meta.hasSuggestions = true;
    return (0, helpers_1.interceptReport)(rule, (context, descriptor) => {
        /**
         * Because TypeScript ESLint's rule provides a different message id for the
         * methods String#startsWith and String#endsWith, we reuse that very same
         * identifier as the message id of the fix transformed into a suggestion.
         */
        const { fix, messageId } = descriptor;
        const suggest = [
            {
                messageId,
                fix,
            },
        ];
        delete descriptor['fix'];
        context.report({ ...descriptor, suggest });
    });
}
exports.decorate = decorate;
//# sourceMappingURL=decorator.js.map