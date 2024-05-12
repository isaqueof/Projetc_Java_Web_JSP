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
// https://sonarsource.github.io/rspec/#/rspec/S6849/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const eslint_plugin_jsx_a11y_1 = require("eslint-plugin-jsx-a11y");
const helpers_1 = require("../helpers");
const langRule = eslint_plugin_jsx_a11y_1.rules['lang'];
const htmlHasLangRule = eslint_plugin_jsx_a11y_1.rules['html-has-lang'];
const decoratedHasLangRule = decorate(htmlHasLangRule);
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, (context, reportDescriptor) => {
        const node = reportDescriptor.node;
        reportDescriptor.node = node.name;
        context.report(reportDescriptor);
    });
}
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            ...langRule.meta.messages,
            ...decoratedHasLangRule.meta.messages,
        },
    },
    create(context) {
        const langListener = langRule.create(context);
        const htmlHasLangListener = decoratedHasLangRule.create(context);
        return (0, helpers_1.mergeRules)(langListener, htmlHasLangListener);
    },
};
//# sourceMappingURL=rule.js.map