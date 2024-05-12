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
// https://sonarsource.github.io/rspec/#/rspec/S2189/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const core_1 = require("../core");
const linter_1 = require("../../linter");
const helpers_1 = require("../helpers");
const noUnmodifiedLoopEslint = core_1.eslintRules['no-unmodified-loop-condition'];
exports.rule = {
    meta: {
        messages: { ...noUnmodifiedLoopEslint.meta.messages },
    },
    create(context) {
        /**
         * Decorates ESLint `no-unmodified-loop-condition` to raise one issue per symbol.
         */
        const alreadyRaisedSymbols = new Set();
        const ruleDecoration = (0, helpers_1.interceptReport)(noUnmodifiedLoopEslint, function (context, descriptor) {
            const node = descriptor.node;
            const symbol = context.getScope().references.find(v => v.identifier === node)?.resolved;
            /** Ignoring symbols that have already been reported */
            if ((0, helpers_1.isUndefined)(node) || (symbol && alreadyRaisedSymbols.has(symbol))) {
                return;
            }
            /** Ignoring symbols called on or passed as arguments */
            for (const reference of symbol?.references ?? []) {
                const id = reference.identifier;
                if (id.parent?.type === 'CallExpression' &&
                    id.parent.arguments.includes(id)) {
                    return;
                }
                if (id.parent?.type === 'MemberExpression' &&
                    id.parent.parent?.type === 'CallExpression' &&
                    id.parent.object === id) {
                    return;
                }
            }
            if (symbol) {
                alreadyRaisedSymbols.add(symbol);
            }
            context.report(descriptor);
        });
        /**
         * Extends ESLint `no-unmodified-loop-condition` to consider more corner cases.
         */
        const MESSAGE = "Correct this loop's end condition to not be invariant.";
        const ruleExtension = {
            create(context) {
                return {
                    WhileStatement: checkWhileStatement,
                    DoWhileStatement: checkWhileStatement,
                    ForStatement: (node) => {
                        const { test, body } = node;
                        if (!test || (test.type === 'Literal' && test.value === true)) {
                            const hasEndCondition = LoopVisitor.hasEndCondition(body, context);
                            if (!hasEndCondition) {
                                const firstToken = context.sourceCode.getFirstToken(node);
                                context.report({
                                    loc: firstToken.loc,
                                    message: MESSAGE,
                                });
                            }
                        }
                    },
                };
                function checkWhileStatement(node) {
                    const whileStatement = node;
                    if (whileStatement.test.type === 'Literal' && whileStatement.test.value === true) {
                        const hasEndCondition = LoopVisitor.hasEndCondition(whileStatement.body, context);
                        if (!hasEndCondition) {
                            const firstToken = context.sourceCode.getFirstToken(node);
                            context.report({ loc: firstToken.loc, message: MESSAGE });
                        }
                    }
                }
            },
        };
        const decorationListeners = ruleDecoration.create(context);
        const extensionListeners = ruleExtension.create(context);
        return (0, helpers_1.mergeRules)(decorationListeners, extensionListeners);
    },
};
class LoopVisitor {
    constructor() {
        this.hasEndCondition = false;
    }
    static hasEndCondition(node, context) {
        const visitor = new LoopVisitor();
        visitor.visit(node, context);
        return visitor.hasEndCondition;
    }
    visit(root, context) {
        const visitNode = (node, isNestedLoop = false) => {
            switch (node.type) {
                case 'WhileStatement':
                case 'DoWhileStatement':
                case 'ForStatement':
                    isNestedLoop = true;
                    break;
                case 'FunctionExpression':
                case 'FunctionDeclaration':
                    // Don't consider nested functions
                    return;
                case 'BreakStatement':
                    if (!isNestedLoop || !!node.label) {
                        this.hasEndCondition = true;
                    }
                    break;
                case 'YieldExpression':
                case 'ReturnStatement':
                case 'ThrowStatement':
                    this.hasEndCondition = true;
                    return;
            }
            (0, linter_1.childrenOf)(node, context.sourceCode.visitorKeys).forEach(child => visitNode(child, isNestedLoop));
        };
        visitNode(root);
    }
}
//# sourceMappingURL=rule.js.map