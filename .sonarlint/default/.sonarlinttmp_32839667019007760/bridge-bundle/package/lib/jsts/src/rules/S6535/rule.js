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
// https://sonarsource.github.io/rspec/#/rspec/S6535/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const core_1 = require("../core");
const helpers_1 = require("../helpers");
/**
 * We want to merge ESLint rules 'no-useless-escape' and 'no-nonoctal-decimal-escape'. However,
 * both share a common message id 'escapeBackslash' but a different description for quickfixes.
 * To prevent one overwritting the other, we need to decorate one and map the conflicting message
 * id to a different one when intercepting a report.
 *
 * Here we arbitrarily choose to decorate 'no-nonoctal-decimal-escape'.
 */
const noUselessEscapeRule = core_1.eslintRules['no-useless-escape'];
const noNonoctalDecimalEscapeRule = core_1.eslintRules['no-nonoctal-decimal-escape'];
/**
 * We replace the message id 'escapeBackslash' of 'no-nonoctal-decimal-escape' with 'nonOctalEscapeBacklash'.
 */
noNonoctalDecimalEscapeRule.meta.messages['nonOctalEscapeBacklash'] =
    noNonoctalDecimalEscapeRule.meta.messages['escapeBackslash'];
delete noNonoctalDecimalEscapeRule.meta.messages['escapeBackslash'];
/**
 * We decorate 'no-nonoctal-decimal-escape' to map suggestions with the message id 'escapeBackslash' to 'nonOctalEscapeBacklash'.
 */
const decoratedNoNonoctalDecimalEscapeRule = decorateNoNonoctalDecimalEscape(noNonoctalDecimalEscapeRule);
function decorateNoNonoctalDecimalEscape(rule) {
    return (0, helpers_1.interceptReport)(rule, (context, descriptor) => {
        const { suggest, ...rest } = descriptor;
        suggest?.forEach(s => {
            const suggestion = s;
            if (suggestion.messageId === 'escapeBackslash') {
                suggestion.messageId = 'nonOctalEscapeBacklash';
            }
        });
        context.report({ suggest, ...rest });
    });
}
exports.rule = {
    // meta of `no-useless-escape` and `no-nonoctal-decimal-escape` are required for issue messages and quickfixes
    meta: {
        hasSuggestions: true,
        messages: {
            ...noUselessEscapeRule.meta.messages,
            ...decoratedNoNonoctalDecimalEscapeRule.meta.messages,
        },
    },
    create(context) {
        const noUselessEscapeListener = noUselessEscapeRule.create(context);
        const decoratedNoNonoctalDecimalEscapeListener = decoratedNoNonoctalDecimalEscapeRule.create(context);
        return (0, helpers_1.mergeRules)(noUselessEscapeListener, decoratedNoNonoctalDecimalEscapeListener);
    },
};
//# sourceMappingURL=rule.js.map