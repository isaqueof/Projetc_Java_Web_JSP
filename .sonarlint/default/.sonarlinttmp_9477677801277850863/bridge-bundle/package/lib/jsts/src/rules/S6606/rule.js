"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
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
const typescript_eslint_1 = require("../typescript-eslint");
const helpers_1 = require("../helpers");
const preferNullishCoalescingRule = typescript_eslint_1.tsEslintRules['prefer-nullish-coalescing'];
exports.rule = (0, helpers_1.interceptReport)(preferNullishCoalescingRule, (context, reportDescriptor) => {
    const { node: token, messageId } = reportDescriptor;
    if (messageId === 'preferNullishOverOr') {
        const services = context.sourceCode.parserServices;
        const rangeIndex = token.range[0];
        const node = context.sourceCode.getNodeByRangeIndex(rangeIndex);
        const leftOperand = node.left;
        const leftOperandType = (0, helpers_1.getTypeFromTreeNode)(leftOperand, services);
        if (leftOperandType.isUnion() &&
            leftOperandType.types.some(helpers_1.isNullOrUndefinedType) &&
            (leftOperandType.types.some(helpers_1.isBooleanType) || leftOperandType.types.some(helpers_1.isObjectType))) {
            return;
        }
    }
    context.report(reportDescriptor);
});
//# sourceMappingURL=rule.js.map