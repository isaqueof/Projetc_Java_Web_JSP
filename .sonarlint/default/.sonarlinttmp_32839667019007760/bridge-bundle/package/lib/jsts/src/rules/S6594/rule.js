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
// https://sonarsource.github.io/rspec/#/rspec/S6594/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const regex_1 = require("../helpers/regex");
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            useExec: 'Use the "RegExp.exec()" method instead.',
            suggestExec: 'Replace with "RegExp.exec()"',
        },
    },
    create(context) {
        const services = context.sourceCode.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            "CallExpression[arguments.length=1] > MemberExpression.callee[property.name='match'][computed=false]": (memberExpr) => {
                const { object, property } = memberExpr;
                if (!(0, helpers_1.isString)(object, services)) {
                    return;
                }
                const callExpr = memberExpr.parent;
                const regex = (0, regex_1.getParsedRegex)(callExpr.arguments[0], context);
                if (regex?.flags.global) {
                    return;
                }
                const variable = getLhsVariable(callExpr);
                for (const ref of variable?.references ?? []) {
                    const id = ref.identifier;
                    const parent = (0, helpers_1.getNodeParent)(id);
                    if ((0, helpers_1.isMemberWithProperty)(parent, 'length')) {
                        return;
                    }
                }
                context.report({
                    node: property,
                    messageId: 'useExec',
                    suggest: [
                        {
                            messageId: 'suggestExec',
                            fix(fixer) {
                                const strText = context.sourceCode.getText(object);
                                const regText = context.sourceCode.getText(callExpr.arguments[0]);
                                const code = `RegExp(${regText}).exec(${strText})`;
                                return fixer.replaceText(callExpr, code);
                            },
                        },
                    ],
                });
            },
        };
        /**
         * Extracts the left-hand side variable of expressions
         * like `x` in `const x = <node>` or `x` in `x = <node>`.
         */
        function getLhsVariable(node) {
            const parent = (0, helpers_1.getNodeParent)(node);
            let ident;
            if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
                ident = parent.id;
            }
            else if (parent.type === 'AssignmentExpression' && parent.left.type === 'Identifier') {
                ident = parent.left;
            }
            if (ident) {
                return (0, helpers_1.getVariableFromName)(context, ident.name);
            }
            return null;
        }
    },
};
//# sourceMappingURL=rule.js.map