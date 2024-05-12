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
// https://sonarsource.github.io/rspec/#/rspec/S6544/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const typescript_eslint_1 = require("../typescript-eslint");
const core_1 = require("../core");
const helpers_1 = require("../helpers");
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
/**
 * We keep a single occurence of issues raised by both rules, discarding the ones raised by 'no-async-promise-executor'
 * The current logic relies on the fact that the listener of 'no-misused-promises' runs first because
 * it is alphabetically "smaller", which is how we set them up in mergeRules.
 */
/**
 * start offsets of nodes that raised issues in typescript-eslint's no-misused-promises
 */
const flaggedNodeStarts = new Map();
const noMisusedPromisesRule = typescript_eslint_1.tsEslintRules['no-misused-promises'];
const decoratedNoMisusedPromisesRule = (0, helpers_1.interceptReport)(noMisusedPromisesRule, (context, descriptor) => {
    if ('node' in descriptor) {
        const node = descriptor.node;
        const start = node.range[0];
        if (!flaggedNodeStarts.get(start)) {
            flaggedNodeStarts.set(start, true);
            if (helpers_1.FUNCTION_NODES.includes(node.type)) {
                const loc = (0, locations_1.getMainFunctionTokenLocation)(node, node.parent, context);
                context.report({ ...descriptor, loc });
            }
            else {
                context.report(descriptor);
            }
        }
    }
});
const noAsyncPromiseExecutorRule = core_1.eslintRules['no-async-promise-executor'];
const decoratedNoAsyncPromiseExecutorRule = (0, helpers_1.interceptReport)(noAsyncPromiseExecutorRule, (context, descriptor) => {
    if ('node' in descriptor) {
        const start = descriptor.node.range[0];
        if (!flaggedNodeStarts.get(start)) {
            context.report(descriptor);
        }
    }
});
exports.rule = {
    meta: {
        messages: {
            ...decoratedNoMisusedPromisesRule.meta.messages,
            ...decoratedNoAsyncPromiseExecutorRule.meta.messages,
        },
        hasSuggestions: true,
    },
    create(context) {
        return {
            'Program:exit': () => {
                flaggedNodeStarts.clear();
            },
            ...(0, helpers_1.mergeRules)(decoratedNoAsyncPromiseExecutorRule.create(context), decoratedNoMisusedPromisesRule.create(context)),
        };
    },
};
//# sourceMappingURL=rule.js.map