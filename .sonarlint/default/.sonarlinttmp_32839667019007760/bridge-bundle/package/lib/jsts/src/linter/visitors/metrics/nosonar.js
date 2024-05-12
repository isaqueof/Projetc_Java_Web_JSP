"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNoSonarLines = void 0;
const comments_1 = require("./comments");
/**
 * Finds the line numbers of `NOSONAR` comments
 *
 * `NOSONAR` comments are indicators for SonarQube to ignore
 * any issues raised on the same lines as those where appear
 * such comments.
 *
 * @param sourceCode the source code to visit
 * @returns the line numbers of `NOSONAR` comments
 */
function findNoSonarLines(sourceCode) {
    return {
        nosonarLines: (0, comments_1.findCommentLines)(sourceCode, false).nosonarLines,
    };
}
exports.findNoSonarLines = findNoSonarLines;
//# sourceMappingURL=nosonar.js.map