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
// https://sonarsource.github.io/rspec/#/rspec/S6759/javascript
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const ts = __importStar(require("typescript"));
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            readOnlyProps: 'Mark the props of the component as read-only.',
            readOnlyPropsFix: 'Mark the props as read-only',
        },
    },
    create(context) {
        const services = context.sourceCode.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        const functionInfo = [];
        return {
            ':function'() {
                functionInfo.push({ returns: [] });
            },
            ':function:exit'(node) {
                /* Functional component */
                const info = functionInfo.pop();
                if (!info || !isFunctionalComponent(node, info)) {
                    return;
                }
                /* Provides props */
                const [props] = node.params;
                if (!props) {
                    return;
                }
                /* Includes type annotation */
                const { typeAnnotation } = props;
                if (!typeAnnotation) {
                    return;
                }
                /* Read-only props */
                if (!isReadOnly(props, services)) {
                    context.report({
                        node: props,
                        messageId: 'readOnlyProps',
                        suggest: [
                            {
                                messageId: 'readOnlyPropsFix',
                                fix(fixer) {
                                    const tpe = typeAnnotation.typeAnnotation;
                                    const oldText = context.sourceCode.getText(tpe);
                                    const newText = `Readonly<${oldText}>`;
                                    return fixer.replaceText(tpe, newText);
                                },
                            },
                        ],
                    });
                }
            },
            ReturnStatement(node) {
                (0, helpers_1.last)(functionInfo).returns.push(node);
            },
        };
        /**
         * A function is considered to be a React functional component if it
         * is a named function declaration with a starting uppercase letter,
         * it takes at most one parameter, and it returns some JSX value.
         */
        function isFunctionalComponent(node, info) {
            /* Named function declaration */
            if (node.type !== 'FunctionDeclaration' || node.id === null) {
                return false;
            }
            /* Starts with uppercase */
            const name = node.id.name;
            if (!(name && /^[A-Z]/.test(name))) {
                return false;
            }
            /* At most one parameter (for props) */
            const paramCount = node.params.length;
            if (paramCount > 1) {
                return false;
            }
            /* Returns JSX value */
            const { returns } = info;
            for (const ret of returns) {
                if (!ret.argument) {
                    continue;
                }
                const value = (0, helpers_1.getUniqueWriteUsageOrNode)(context, ret.argument);
                if (value.type.startsWith('JSX')) {
                    return true;
                }
            }
            return false;
        }
        /**
         * A props type is considered to be read-only if the type annotation
         * is decorated with TypeScript utility type `Readonly` or if it refers
         * to a pure type declaration, i.e. where all its members are read-only.
         */
        function isReadOnly(props, services) {
            const tpe = (0, helpers_1.getTypeFromTreeNode)(props, services);
            /* Readonly utility type */
            const { aliasSymbol } = tpe;
            if (aliasSymbol?.escapedName === 'Readonly') {
                return true;
            }
            /* Resolve symbol definition */
            const symbol = tpe.getSymbol();
            if (!symbol?.declarations) {
                /* Kill the noise */
                return true;
            }
            /* Pure type declaration */
            const declarations = symbol.declarations;
            for (const decl of declarations) {
                if (ts.isInterfaceDeclaration(decl)) {
                    const node = services.tsNodeToESTreeNodeMap.get(decl);
                    if (node?.type === 'TSInterfaceDeclaration') {
                        const { body: { body: members }, } = node;
                        if (members.every(m => m.type === 'TSPropertySignature' && m.readonly)) {
                            return true;
                        }
                    }
                }
                if (ts.isTypeLiteralNode(decl)) {
                    const node = services.tsNodeToESTreeNodeMap.get(decl);
                    if (node?.type === 'TSTypeLiteral') {
                        const { members } = node;
                        if (members.every(m => m.type === 'TSPropertySignature' && m.readonly)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    },
};
//# sourceMappingURL=rule.js.map