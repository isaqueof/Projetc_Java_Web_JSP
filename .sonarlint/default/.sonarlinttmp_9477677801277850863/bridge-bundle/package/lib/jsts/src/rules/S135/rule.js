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
// https://sonarsource.github.io/rspec/#/rspec/S135/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const parameters_1 = require("../../linter/parameters");
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
        let jumpTargets = [];
        function enterScope() {
            jumpTargets.push(new JumpTarget());
        }
        function leaveScope() {
            jumpTargets.pop();
        }
        function increateNumberOfJumpsInScopes(jump, label) {
            for (const jumpTarget of [...jumpTargets].reverse()) {
                jumpTarget.jumps.push(jump);
                if (label === jumpTarget.label) {
                    break;
                }
            }
        }
        function leaveScopeAndCheckNumberOfJumps(node) {
            const jumps = jumpTargets.pop()?.jumps;
            if (jumps && jumps.length > 1) {
                const sourceCode = context.sourceCode;
                const firstToken = sourceCode.getFirstToken(node);
                context.report({
                    loc: firstToken.loc,
                    message: (0, helpers_1.toEncodedMessage)('Reduce the total number of "break" and "continue" statements in this loop to use one at most.', jumps, jumps.map(jmp => jmp.type === 'BreakStatement' ? '"break" statement.' : '"continue" statement.')),
                });
            }
        }
        return {
            Program: () => {
                jumpTargets = [];
            },
            BreakStatement: (node) => {
                const breakStatement = node;
                increateNumberOfJumpsInScopes(breakStatement, breakStatement.label?.name);
            },
            ContinueStatement: (node) => {
                const continueStatement = node;
                increateNumberOfJumpsInScopes(continueStatement, continueStatement.label?.name);
            },
            SwitchStatement: enterScope,
            'SwitchStatement:exit': leaveScope,
            ForStatement: enterScope,
            'ForStatement:exit': leaveScopeAndCheckNumberOfJumps,
            ForInStatement: enterScope,
            'ForInStatement:exit': leaveScopeAndCheckNumberOfJumps,
            ForOfStatement: enterScope,
            'ForOfStatement:exit': leaveScopeAndCheckNumberOfJumps,
            WhileStatement: enterScope,
            'WhileStatement:exit': leaveScopeAndCheckNumberOfJumps,
            DoWhileStatement: enterScope,
            'DoWhileStatement:exit': leaveScopeAndCheckNumberOfJumps,
            LabeledStatement: (node) => {
                const labeledStatement = node;
                jumpTargets.push(new JumpTarget(labeledStatement.label.name));
            },
            'LabeledStatement:exit': leaveScope,
        };
    },
};
class JumpTarget {
    constructor(label) {
        this.jumps = [];
        this.label = label;
    }
}
//# sourceMappingURL=rule.js.map