"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNcloc = void 0;
const helpers_1 = require("./helpers");
/**
 * Finds the line numbers of code (ncloc)
 *
 * The line numbers of code denote physical lines that contain at least
 * one character which is neither a whitespace nor a tabulation nor part
 * of a comment.
 *
 * @param sourceCode the ESLint source code
 * @returns the line numbers of code
 */
function findNcloc(sourceCode) {
    const lines = new Set();
    const ast = sourceCode.ast;
    const tokens = [...(ast.tokens ?? [])];
    if (ast.templateBody) {
        tokens.push(...extractVuejsTokens(ast.templateBody));
    }
    for (const token of tokens) {
        (0, helpers_1.addLines)(token.loc.start.line, token.loc.end.line, lines);
    }
    return Array.from(lines).sort((a, b) => a - b);
}
exports.findNcloc = findNcloc;
/**
 * Extracts Vue.js-specific tokens
 *
 * The template section parsed by `vue-eslint-parser` includes tokens for the whole `.vue` file.
 * Everything that is not template-related is either raw text or whitespace. Although the style
 * section is not parsed, its tokens are made available. Therefore, in addition to the tokens of
 * the script section, we consider tokens from the template and style sections as well, provided
 * that they don't denote whitespace or comments.
 */
function extractVuejsTokens(templateBody) {
    const tokens = [];
    let withinStyle = false;
    let withinComment = false;
    for (const token of templateBody.tokens) {
        /**
         * Style section
         */
        if (token.type === 'HTMLTagOpen' && token.value === 'style') {
            withinStyle = true;
        }
        else if (token.type === 'HTMLEndTagOpen' && token.value === 'style') {
            withinStyle = false;
        }
        /**
         * Whitespace tokens should be ignored in accordance with the
         * definition of ncloc.
         */
        if (token.type === 'HTMLWhitespace') {
            continue;
        }
        /**
         * Tokens of type 'HTMLRawText' denote either tokens from the
         * style section or tokens from the script section. Since the
         * tokens from the script section are already retrieved from
         * the root of the ast, we ignore those and only consider the
         * tokens from the style section.
         */
        if (token.type === 'HTMLRawText' && !withinStyle) {
            continue;
        }
        /**
         * CSS comment tokens should be ignored in accordance with the
         * definition of ncloc.
         */
        if (withinStyle && !withinComment && token.value === '/*') {
            withinComment = true;
            continue;
        }
        else if (withinStyle && withinComment) {
            withinComment = token.value !== '*/';
            continue;
        }
        tokens.push(token);
    }
    return tokens;
}
//# sourceMappingURL=ncloc.js.map