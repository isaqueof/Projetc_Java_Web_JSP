"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visitAndCountIf = void 0;
const __1 = require("../../");
/**
 * Counts the number of nodes matching a predicate
 * @param sourceCode the source code to vist
 * @param predicate the condition to count the node
 * @returns the number of nodes matching the predicate
 */
function visitAndCountIf(sourceCode, predicate) {
    let results = 0;
    (0, __1.visit)(sourceCode, node => {
        if (predicate(node)) {
            results++;
        }
    });
    return results;
}
exports.visitAndCountIf = visitAndCountIf;
//# sourceMappingURL=counter.js.map