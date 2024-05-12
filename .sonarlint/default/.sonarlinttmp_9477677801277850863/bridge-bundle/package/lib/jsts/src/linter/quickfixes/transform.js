"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFixes = void 0;
const messages_1 = require("./messages");
const rules_1 = require("./rules");
/**
 * Transforms ESLint fixes and suggestions into SonarLint quick fixes
 * @param source the source code
 * @param messages the ESLint messages to transform
 * @returns the transformed quick fixes
 */
function transformFixes(source, messages) {
    if (!hasQuickFix(messages)) {
        return [];
    }
    const quickFixes = [];
    if (messages.fix) {
        quickFixes.push({
            message: (0, messages_1.getQuickFixMessage)(messages.ruleId),
            edits: [fixToEdit(source, messages.fix)],
        });
    }
    if (messages.suggestions) {
        messages.suggestions.forEach(suggestion => {
            quickFixes.push({
                message: suggestion.desc,
                edits: [fixToEdit(source, suggestion.fix)],
            });
        });
    }
    return quickFixes;
}
exports.transformFixes = transformFixes;
/**
 * Checks if an ESLint fix is convertible into a SonarLint quick fix
 *
 * An ESLint fix is convertible into a SonarLint quick fix iff:
 * - it includes a fix or suggestions
 * - the quick fix of the rule is enabled
 *
 * @param message an ESLint message
 * @returns true if the message is convertible
 */
function hasQuickFix(message) {
    if (!message.fix && (!message.suggestions || message.suggestions.length === 0)) {
        return false;
    }
    return !!message.ruleId && rules_1.quickFixRules.has(message.ruleId);
}
/**
 * Transform an ESLint fix into a SonarLint quick fix edit
 * @param source the source code
 * @param fix the ESLint fix to transform
 * @returns the transformed SonarLint quick fix edit
 */
function fixToEdit(source, fix) {
    const [start, end] = fix.range;
    const startPos = source.getLocFromIndex(start);
    const endPos = source.getLocFromIndex(end);
    return {
        loc: {
            line: startPos.line,
            column: startPos.column,
            endLine: endPos.line,
            endColumn: endPos.column,
        },
        text: fix.text,
    };
}
//# sourceMappingURL=transform.js.map