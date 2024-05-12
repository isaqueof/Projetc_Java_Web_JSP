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
// https://sonarsource.github.io/rspec/#/rspec/S6747/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
/**
 * The core implementation of the rule includes a fix without a message.
 * That fix suggests using a standard property name that is available in
 * the report data. This decorator turns the reported fix into a suggestion
 * and adds to it a dynamic description rather than a fixed one.
 */
function decorate(rule) {
    rule.meta.hasSuggestions = true;
    return (0, helpers_1.interceptReport)(rule, (context, descriptor) => {
        const { messageId, fix, data, ...rest } = descriptor;
        if (messageId !== 'unknownPropWithStandardName') {
            context.report(descriptor);
            return;
        }
        const suggest = [
            {
                desc: `Replace with '${data.standardName}'`,
                fix,
            },
        ];
        context.report({ messageId, data, suggest, ...rest });
    });
}
exports.decorate = decorate;
//# sourceMappingURL=decorator.js.map