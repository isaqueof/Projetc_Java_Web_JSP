"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSyntaxHighlighting = void 0;
const helpers_1 = require("./metrics/helpers");
/**
 * Computes the syntax highlighting of an ESLint source code
 * @param sourceCode the source code to highlight
 * @returns a list of highlighted tokens
 */
function getSyntaxHighlighting(sourceCode) {
    const { tokens, comments } = (0, helpers_1.extractTokensAndComments)(sourceCode);
    const highlights = [];
    for (const token of tokens) {
        switch (token.type) {
            case 'HTMLTagOpen':
            case 'HTMLTagClose':
            case 'HTMLEndTagOpen':
            case 'HTMLSelfClosingTagClose':
            case 'Keyword':
                highlight(token, 'KEYWORD', highlights);
                break;
            case 'HTMLLiteral':
            case 'String':
            case 'Template':
            case 'RegularExpression':
                highlight(token, 'STRING', highlights);
                break;
            case 'Numeric':
                highlight(token, 'CONSTANT', highlights);
                break;
            case 'Identifier': {
                const node = sourceCode.getNodeByRangeIndex(token.range[0]);
                // @ts-ignore
                if (token.value === 'type' && node?.type === 'TSTypeAliasDeclaration') {
                    highlight(token, 'KEYWORD', highlights);
                }
                // @ts-ignore
                if (token.value === 'as' && node?.type === 'TSAsExpression') {
                    highlight(token, 'KEYWORD', highlights);
                }
                break;
            }
        }
    }
    for (const comment of comments) {
        if ((comment.type === 'Block' && comment.value.startsWith('*')) ||
            comment.type === 'HTMLBogusComment') {
            highlight(comment, 'STRUCTURED_COMMENT', highlights);
        }
        else {
            highlight(comment, 'COMMENT', highlights);
        }
    }
    return { highlights };
}
exports.getSyntaxHighlighting = getSyntaxHighlighting;
function highlight(node, highlightKind, highlights) {
    if (!node.loc) {
        return;
    }
    const startPosition = node.loc.start;
    const endPosition = node.loc.end;
    highlights.push({
        location: {
            startLine: startPosition.line,
            startCol: startPosition.column,
            endLine: endPosition.line,
            endCol: endPosition.column,
        },
        textType: highlightKind,
    });
}
//# sourceMappingURL=syntax-highlighting.js.map