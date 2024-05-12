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
// https://sonarsource.github.io/rspec/#/rspec/S4721/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const EXEC_FUNCTIONS = ['exec', 'execSync'];
const SPAWN_EXEC_FILE_FUNCTIONS = ['spawn', 'spawnSync', 'execFile', 'execFileSync'];
const CHILD_PROCESS_MODULE = 'child_process';
exports.rule = {
    meta: {
        messages: {
            safeOSCommand: 'Make sure that executing this OS command is safe here.',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => checkOSCommand(context, node),
        };
    },
};
function checkOSCommand(context, call) {
    const { callee, arguments: args } = call;
    const fqn = (0, helpers_1.getFullyQualifiedName)(context, call);
    if (!fqn) {
        return;
    }
    const [module, method] = fqn.split('.');
    if (module === CHILD_PROCESS_MODULE && isQuestionable(method, args)) {
        context.report({
            node: callee,
            messageId: 'safeOSCommand',
        });
    }
}
function isQuestionable(method, [command, ...otherArguments]) {
    // if command is hardcoded => no issue
    if (!command || (0, helpers_1.isLiteral)(command) || (0, helpers_1.isStaticTemplateLiteral)(command)) {
        return false;
    }
    // for `spawn` and `execFile`, `shell` option must be set to `true`
    if (SPAWN_EXEC_FILE_FUNCTIONS.includes(method)) {
        return containsShellOption(otherArguments);
    }
    return EXEC_FUNCTIONS.includes(method);
}
function containsShellOption(otherArguments) {
    return otherArguments.some(arg => arg.type === 'ObjectExpression' &&
        arg.properties.filter(v => v.type === 'Property').some(({ key, value }) => (0, helpers_1.isIdentifier)(key, 'shell') && value.type === 'Literal' && value.value === true));
}
//# sourceMappingURL=rule.js.map