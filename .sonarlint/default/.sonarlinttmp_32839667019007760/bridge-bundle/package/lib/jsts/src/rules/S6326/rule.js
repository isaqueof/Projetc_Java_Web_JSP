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
// https://sonarsource.github.io/rspec/#/rspec/S6326/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const regex_1 = require("../helpers/regex");
exports.rule = (0, regex_1.createRegExpRule)(context => {
    let rawPattern;
    return {
        onRegExpLiteralEnter: (node) => {
            rawPattern = node.raw;
        },
        onCharacterEnter: (node) => {
            if (node.raw !== ' ' || node.parent.type === 'CharacterClass') {
                return;
            }
            const nextChar = rawPattern[node.start + 1];
            if (nextChar !== ' ') {
                const spacesBefore = countSpacesBefore(rawPattern, node.start);
                if (spacesBefore > 0) {
                    const spacesNumber = spacesBefore + 1;
                    const quantifier = `{${spacesNumber}}`;
                    const [start, end] = (0, regex_1.getRegexpRange)(context.node, node);
                    const range = [start - spacesNumber + 1, end];
                    context.reportRegExpNode({
                        message: `If multiple spaces are required here, use number quantifier (${quantifier}).`,
                        regexpNode: node,
                        offset: [-spacesNumber + 1, 0],
                        node: context.node,
                        suggest: [
                            {
                                desc: `Use quantifier ${quantifier}`,
                                fix: fixer => fixer.replaceTextRange(range, ` ${quantifier}`),
                            },
                        ],
                    });
                }
            }
        },
    };
}, {
    meta: {
        hasSuggestions: true,
    },
});
function countSpacesBefore(pattern, index) {
    let counter = 0;
    for (let i = index - 1; i > 0; i--) {
        if (pattern[i] === ' ') {
            counter++;
        }
        else {
            break;
        }
    }
    return counter;
}
//# sourceMappingURL=rule.js.map