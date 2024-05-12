"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLocation = void 0;
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
exports.normalizeLocation = normalizeLocation;
//# sourceMappingURL=normalize.js.map