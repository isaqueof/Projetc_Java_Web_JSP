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
// https://sonarsource.github.io/rspec/#/rspec/S3533/javascript
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
const helpers = __importStar(require("../helpers"));
const helpers_1 = require("../helpers");
exports.rule = {
    meta: {
        messages: {
            standardImport: 'Use a standard "import" statement instead of "{{adhocImport}}".',
        },
    },
    create(context) {
        const services = context.sourceCode.parserServices;
        return {
            'CallExpression[callee.type="Identifier"]': (node) => {
                if (context.getScope().type !== 'module' && context.getScope().type !== 'global') {
                    return;
                }
                const callExpression = node;
                const identifier = callExpression.callee;
                if (isAmdImport(callExpression, identifier, services) ||
                    isCommonJsImport(callExpression, identifier, services)) {
                    context.report({
                        node: identifier,
                        messageId: 'standardImport',
                        data: {
                            adhocImport: identifier.name,
                        },
                    });
                }
            },
        };
    },
};
function isString(node, services) {
    return ((helpers.isRequiredParserServices(services) && helpers.isString(node, services)) ||
        (0, helpers_1.isStringLiteral)(node));
}
function isCommonJsImport(callExpression, identifier, services) {
    return (callExpression.arguments.length === 1 &&
        isString(callExpression.arguments[0], services) &&
        identifier.name === 'require');
}
function isAmdImport(callExpression, identifier, services) {
    if (identifier.name !== 'require' && identifier.name !== 'define') {
        return false;
    }
    if (callExpression.arguments.length !== 2 && callExpression.arguments.length !== 3) {
        return false;
    }
    return (helpers.isRequiredParserServices(services) &&
        helpers.isFunction(callExpression.arguments[callExpression.arguments.length - 1], services));
}
//# sourceMappingURL=rule.js.map