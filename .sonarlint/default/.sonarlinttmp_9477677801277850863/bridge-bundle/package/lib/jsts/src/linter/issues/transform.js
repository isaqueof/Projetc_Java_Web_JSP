"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformMessages = void 0;
const decode_1 = require("./decode");
const message_1 = require("./message");
const extract_1 = require("./extract");
/**
 * Transforms ESLint messages into SonarQube issues
 *
 * The result of linting a source code requires post-linting transformations
 * to return SonarQube issues. These transformations include extracting ucfg
 * paths, decoding issues with secondary locations as well as converting
 * quick fixes.
 *
 * Besides issues, a few metrics are computed during linting in the form of
 * an internal custom rule execution, namely cognitive complexity and symbol
 * highlighting. These custom rules also produce issues that are extracted.
 *
 * Transforming an ESLint message into a SonarQube issue implies:
 * - extracting UCFG rule file paths
 * - converting ESLint messages into SonarQube issues
 * - converting ESLint fixes into SonarLint quick fixes
 * - decoding encoded secondary locations
 * - normalizing issue locations
 *
 * @param messages ESLint messages to transform
 * @param ctx contextual information
 * @returns the linting result
 */
function transformMessages(messages, ctx) {
    const issues = [];
    const ucfgPaths = [];
    for (const message of messages) {
        if (message.ruleId === 'ucfg') {
            ucfgPaths.push(message.message);
        }
        else {
            let issue = (0, message_1.convertMessage)(ctx.sourceCode, message);
            if (issue !== null) {
                issue = normalizeLocation((0, decode_1.decodeSonarRuntime)(ctx.rules.get(issue.ruleId), issue));
                issues.push(issue);
            }
        }
    }
    const highlightedSymbols = (0, extract_1.extractHighlightedSymbols)(issues);
    const cognitiveComplexity = (0, extract_1.extractCognitiveComplexity)(issues);
    return {
        issues,
        ucfgPaths,
        highlightedSymbols,
        cognitiveComplexity,
    };
}
exports.transformMessages = transformMessages;
/**
 * Normalizes an issue location
 *
 * SonarQube uses 0-based column indexing when it comes to issue locations
 * while ESLint uses 1-based column indexing for message locations.
 *
 * @param issue the issue to normalize
 * @returns the normalized issue
 */
function normalizeLocation(issue) {
    issue.column -= 1;
    if (issue.endColumn) {
        issue.endColumn -= 1;
    }
    return issue;
}
//# sourceMappingURL=transform.js.map