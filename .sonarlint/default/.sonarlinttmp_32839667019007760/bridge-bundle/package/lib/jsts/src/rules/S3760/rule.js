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
// https://sonarsource.github.io/rspec/#/rspec/S3760/javascript
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const typescript_1 = __importDefault(require("typescript"));
const helpers_1 = require("../helpers");
const parameters_1 = require("../../linter/parameters");
const MESSAGE = 'Convert this operand into a number.';
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
    create(context) {
        const services = context.sourceCode.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            BinaryExpression: (node) => {
                const binaryExpression = node;
                const operator = binaryExpression.operator;
                const leftType = (0, helpers_1.getTypeFromTreeNode)(binaryExpression.left, services);
                const rightType = (0, helpers_1.getTypeFromTreeNode)(binaryExpression.right, services);
                if (operator === '+') {
                    checkPlus(leftType, rightType, binaryExpression, context);
                }
                if (operator === '<' || operator === '>' || operator === '<=' || operator === '>=') {
                    checkComparison(leftType, rightType, binaryExpression, context);
                }
                if (operator === '-' || operator === '*' || operator === '/' || operator === '%') {
                    checkArithmetic(leftType, rightType, binaryExpression, context);
                }
            },
            AssignmentExpression: (node) => {
                const assignmentExpression = node;
                const operator = assignmentExpression.operator;
                const leftType = (0, helpers_1.getTypeFromTreeNode)(assignmentExpression.left, services);
                const rightType = (0, helpers_1.getTypeFromTreeNode)(assignmentExpression.right, services);
                if (operator === '+=') {
                    checkPlus(leftType, rightType, assignmentExpression, context);
                }
                if (operator === '-=' || operator === '*=' || operator === '/=' || operator === '%=') {
                    checkArithmetic(leftType, rightType, assignmentExpression, context);
                }
            },
            'UnaryExpression[operator="-"]': (node) => {
                const unaryExpression = node;
                const type = (0, helpers_1.getTypeFromTreeNode)(unaryExpression.argument, services);
                if (isBooleanStringOrDate(type)) {
                    context.report({
                        node: unaryExpression.argument,
                        message: (0, helpers_1.toEncodedMessage)(MESSAGE, []),
                    });
                }
            },
            UpdateExpression: (node) => {
                const updateExpression = node;
                const type = (0, helpers_1.getTypeFromTreeNode)(updateExpression.argument, services);
                if (isBooleanStringOrDate(type)) {
                    context.report({
                        node: updateExpression.argument,
                        message: (0, helpers_1.toEncodedMessage)(MESSAGE, []),
                    });
                }
            },
        };
    },
};
function isDateMinusDateException(leftType, rightType, operator) {
    if (operator !== '-' && operator !== '-=') {
        return false;
    }
    if (leftType.symbol?.name === 'Date' &&
        (rightType.symbol?.name === 'Date' || (rightType.flags & typescript_1.default.TypeFlags.Any) > 0)) {
        return true;
    }
    if (rightType.symbol?.name === 'Date' && (leftType.flags & typescript_1.default.TypeFlags.Any) > 0) {
        return true;
    }
    return false;
}
function checkPlus(leftType, rightType, expression, context) {
    if (isNumber(leftType) && isBooleanOrDate(rightType)) {
        context.report({
            node: expression.right,
            message: (0, helpers_1.toEncodedMessage)(MESSAGE, [expression.left]),
        });
    }
    if (isNumber(rightType) && isBooleanOrDate(leftType)) {
        context.report({
            node: expression.left,
            message: (0, helpers_1.toEncodedMessage)(MESSAGE, [expression.right]),
        });
    }
}
function checkComparison(leftType, rightType, expression, context) {
    if (isBooleanOrNumber(leftType) && isBooleanStringOrDate(rightType)) {
        context.report({
            node: expression.right,
            message: (0, helpers_1.toEncodedMessage)(MESSAGE, []),
        });
    }
    else if (isBooleanOrNumber(rightType) && isBooleanStringOrDate(leftType)) {
        context.report({
            node: expression.left,
            message: (0, helpers_1.toEncodedMessage)(MESSAGE, []),
        });
    }
}
function checkArithmetic(leftType, rightType, expression, context) {
    if (isDateMinusDateException(leftType, rightType, expression.operator)) {
        return;
    }
    const secondaryLocations = [];
    if (isBooleanStringOrDate(leftType)) {
        secondaryLocations.push(expression.left);
    }
    if (isBooleanStringOrDate(rightType)) {
        secondaryLocations.push(expression.right);
    }
    if (secondaryLocations.length !== 0) {
        context.report({
            node: expression,
            message: (0, helpers_1.toEncodedMessage)('Convert the operands of this operation into numbers.', secondaryLocations),
        });
    }
}
function isBooleanOrDate(type) {
    if (isBoolean(type)) {
        return true;
    }
    return type.symbol?.name === 'Date';
}
function isBooleanOrNumber(type) {
    return isBoolean(type) || isNumber(type);
}
function isBoolean(type) {
    return (type.flags & typescript_1.default.TypeFlags.BooleanLike) > 0 || type.symbol?.name === 'Boolean';
}
function isNumber(type) {
    return (type.flags & typescript_1.default.TypeFlags.NumberLike) > 0 || type.symbol?.name === 'Number';
}
function isBooleanStringOrDate(type) {
    return isBoolean(type) || (0, helpers_1.isStringType)(type) || type.symbol?.name === 'Date';
}
//# sourceMappingURL=rule.js.map