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
// https://sonarsource.github.io/rspec/#/rspec/S6478/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
function decorate(rule) {
    return (0, helpers_1.interceptReportForReact)(rule, (context, report) => {
        const message = 'Move this component definition out of the parent component and pass data as props.';
        const { node } = report;
        const loc = getMainNodeLocation(node, context);
        if (loc) {
            context.report({ ...report, loc, message });
        }
        else {
            context.report({ ...report, message });
        }
    });
    function getMainNodeLocation(node, context) {
        /* class components */
        if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
            if (node.id) {
                return node.id.loc;
            }
            else {
                return context.sourceCode.getFirstToken(node, token => token.value === 'class')?.loc;
            }
        }
        /* functional components */
        if (helpers_1.functionLike.has(node.type)) {
            const fun = node;
            const ctx = context;
            return (0, locations_1.getMainFunctionTokenLocation)(fun, fun.parent, ctx);
        }
        /* should not happen */
        return node.loc;
    }
}
exports.decorate = decorate;
//# sourceMappingURL=decorator.js.map