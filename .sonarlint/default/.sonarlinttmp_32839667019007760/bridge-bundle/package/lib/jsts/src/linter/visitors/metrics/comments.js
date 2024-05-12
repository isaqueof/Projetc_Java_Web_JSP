"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCommentLines = void 0;
const helpers_1 = require("./helpers");
/**
 * A comment marker to tell SonarQube to ignore any issue on the same line
 * as the one with a comment whose text is `NOSONAR` (case-insensitive).
 */
const NOSONAR = 'NOSONAR';
/**
 * Finds the line numbers of comments in the source code
 * @param sourceCode the source code to visit
 * @param ignoreHeaderComments a flag to ignore file header comments
 * @returns the line numbers of comments
 */
function findCommentLines(sourceCode, ignoreHeaderComments) {
    const commentLines = new Set();
    const nosonarLines = new Set();
    let comments = sourceCode.ast.comments;
    // ignore header comments -> comments before first token
    const firstToken = sourceCode.getFirstToken(sourceCode.ast);
    if (firstToken && ignoreHeaderComments) {
        const header = sourceCode.getCommentsBefore(firstToken);
        comments = comments.slice(header.length);
    }
    for (const comment of comments) {
        if (comment.loc) {
            const commentValue = comment.value.startsWith('*')
                ? comment.value.substring(1).trim()
                : comment.value.trim();
            if (commentValue.toUpperCase().startsWith(NOSONAR)) {
                (0, helpers_1.addLines)(comment.loc.start.line, comment.loc.end.line, nosonarLines);
            }
            else if (commentValue.length > 0) {
                (0, helpers_1.addLines)(comment.loc.start.line, comment.loc.end.line, commentLines);
            }
        }
    }
    return {
        commentLines: Array.from(commentLines).sort((a, b) => a - b),
        nosonarLines: Array.from(nosonarLines).sort((a, b) => a - b),
    };
}
exports.findCommentLines = findCommentLines;
//# sourceMappingURL=comments.js.map