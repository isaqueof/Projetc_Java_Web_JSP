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
// https://sonarsource.github.io/rspec/#/rspec/S5868/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const regex_1 = require("../helpers/regex");
const regexpp_1 = require("@eslint-community/regexpp");
const MODIFIABLE_REGEXP_FLAGS_TYPES = [
    'Literal',
    'TemplateLiteral',
    'TaggedTemplateExpression',
];
const metadata = {
    meta: {
        hasSuggestions: true,
    },
};
exports.rule = (0, regex_1.createRegExpRule)(context => {
    function characters(nodes) {
        let current = [];
        const sequences = [current];
        for (const node of nodes) {
            if (node.type === 'Character') {
                current.push(node);
            }
            else if (node.type === 'CharacterClassRange') {
                // for following regexp [xa-z] we produce [[xa],[z]]
                // we would report for example if instead of 'xa' there would be unicode combined class
                current.push(node.min);
                current = [node.max];
                sequences.push(current);
            }
            else if (node.type === 'CharacterSet' && current.length > 0) {
                // CharacterSet is for example [\d], ., or \p{ASCII}
                // see https://github.com/mysticatea/regexpp/blob/master/src/ast.ts#L222
                current = [];
                sequences.push(current);
            }
        }
        return sequences;
    }
    function checkSequence(sequence) {
        // Stop on the first illegal character in the sequence
        for (let index = 0; index < sequence.length; index++) {
            if (checkCharacter(sequence[index], index, sequence)) {
                return;
            }
        }
    }
    function checkCharacter(character, index, characters) {
        // Stop on the first failed check as there may be overlaps between checks
        // for instance a zero-width-sequence containing a modified emoji.
        for (const check of characterChecks) {
            if (check(character, index, characters)) {
                return true;
            }
        }
        return false;
    }
    function checkCombinedCharacter(character, index, characters) {
        let reported = false;
        if (index !== 0 &&
            isCombiningCharacter(character.value) &&
            !isCombiningCharacter(characters[index - 1].value)) {
            const combinedChar = characters[index - 1].raw + characters[index].raw;
            const message = `Move this Unicode combined character '${combinedChar}' outside of the character class`;
            context.reportRegExpNode({ regexpNode: characters[index], node: context.node, message });
            reported = true;
        }
        return reported;
    }
    function checkSurrogatePairTailCharacter(character, index, characters) {
        let reported = false;
        if (index !== 0 && isSurrogatePair(characters[index - 1].value, character.value)) {
            const surrogatePair = characters[index - 1].raw + characters[index].raw;
            const message = `Move this Unicode surrogate pair '${surrogatePair}' outside of the character class or use 'u' flag`;
            const pattern = (0, regex_1.getPatternFromNode)(context.node, context)?.pattern;
            let suggest;
            if (pattern && isValidWithUnicodeFlag(pattern)) {
                suggest = [
                    {
                        desc: "Add unicode 'u' flag to regex",
                        fix: fixer => addUnicodeFlag(fixer, context.node),
                    },
                ];
            }
            context.reportRegExpNode({
                regexpNode: characters[index],
                node: context.node,
                message,
                suggest,
            });
            reported = true;
        }
        return reported;
    }
    function addUnicodeFlag(fixer, node) {
        if ((0, helpers_1.isRegexLiteral)(node)) {
            return insertTextAfter(fixer, node, 'u');
        }
        const regExpConstructor = getRegExpConstructor(node);
        if (!regExpConstructor) {
            return null;
        }
        const args = regExpConstructor.arguments;
        if (args.length === 1) {
            const token = sourceCode.getLastToken(regExpConstructor, { skip: 1 });
            return insertTextAfter(fixer, token, ', "u"');
        }
        if (args.length > 1 && args[1]?.range && hasModifiableFlags(regExpConstructor)) {
            const [start, end] = args[1].range;
            return fixer.insertTextAfterRange([start, end - 1], 'u');
        }
        return null;
    }
    function checkModifiedEmojiCharacter(character, index, characters) {
        let reported = false;
        if (index !== 0 &&
            isEmojiModifier(character.value) &&
            !isEmojiModifier(characters[index - 1].value)) {
            const modifiedEmoji = characters[index - 1].raw + characters[index].raw;
            const message = `Move this Unicode modified Emoji '${modifiedEmoji}' outside of the character class`;
            context.reportRegExpNode({ regexpNode: characters[index], node: context.node, message });
            reported = true;
        }
        return reported;
    }
    function checkRegionalIndicatorCharacter(character, index, characters) {
        let reported = false;
        if (index !== 0 &&
            isRegionalIndicator(character.value) &&
            isRegionalIndicator(characters[index - 1].value)) {
            const regionalIndicator = characters[index - 1].raw + characters[index].raw;
            const message = `Move this Unicode regional indicator '${regionalIndicator}' outside of the character class`;
            context.reportRegExpNode({ regexpNode: characters[index], node: context.node, message });
            reported = true;
        }
        return reported;
    }
    function checkZeroWidthJoinerCharacter(character, index, characters) {
        let reported = false;
        if (index !== 0 &&
            index !== characters.length - 1 &&
            isZeroWidthJoiner(character.value) &&
            !isZeroWidthJoiner(characters[index - 1].value) &&
            !isZeroWidthJoiner(characters[index + 1].value)) {
            // It's practically difficult to determine the full joined character sequence
            // as it may join more than 2 elements that consist of characters or modified Emojis
            // see: https://unicode.org/emoji/charts/emoji-zwj-sequences.html
            const message = 'Move this Unicode joined character sequence outside of the character class';
            context.reportRegExpNode({ regexpNode: characters[index - 1], node: context.node, message });
            reported = true;
        }
        return reported;
    }
    function isValidWithUnicodeFlag(pattern) {
        try {
            validator.validatePattern(pattern, undefined, undefined, true);
            return true;
        }
        catch {
            return false;
        }
    }
    const sourceCode = context.sourceCode;
    const validator = new regexpp_1.RegExpValidator();
    // The order matters as surrogate pair check may trigger at the same time as zero-width-joiner.
    const characterChecks = [
        checkCombinedCharacter,
        checkZeroWidthJoinerCharacter,
        checkModifiedEmojiCharacter,
        checkRegionalIndicatorCharacter,
        checkSurrogatePairTailCharacter,
    ];
    return {
        onCharacterClassEnter(ccNode) {
            for (const chars of characters(ccNode.elements)) {
                checkSequence(chars);
            }
        },
    };
}, metadata);
function isCombiningCharacter(codePoint) {
    return /^[\p{Mc}\p{Me}\p{Mn}]$/u.test(String.fromCodePoint(codePoint));
}
function isSurrogatePair(lead, tail) {
    return lead >= 0xd800 && lead < 0xdc00 && tail >= 0xdc00 && tail < 0xe000;
}
function isEmojiModifier(code) {
    return code >= 0x1f3fb && code <= 0x1f3ff;
}
function isRegionalIndicator(code) {
    return code >= 0x1f1e6 && code <= 0x1f1ff;
}
function isZeroWidthJoiner(code) {
    return code === 0x200d;
}
function getRegExpConstructor(node) {
    return (0, helpers_1.ancestorsChain)(node, new Set(['CallExpression', 'NewExpression'])).find(n => (0, regex_1.isRegExpConstructor)(n));
}
function hasModifiableFlags(regExpConstructor) {
    const args = regExpConstructor.arguments;
    return (typeof args[1]?.range?.[0] === 'number' &&
        typeof args[1]?.range?.[1] === 'number' &&
        (0, regex_1.getFlags)(regExpConstructor) != null &&
        MODIFIABLE_REGEXP_FLAGS_TYPES.includes(args[1].type));
}
function insertTextAfter(fixer, node, text) {
    return node ? fixer.insertTextAfter(node, text) : null;
}
//# sourceMappingURL=rule.js.map