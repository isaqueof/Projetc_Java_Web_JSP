"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countFunctions = void 0;
const helpers_1 = require("./helpers");
/**
 * The ESLint function node types
 */
const FUNCTION_NODES = ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'];
/**
 * Computes the number of functions in the source code
 */
function countFunctions(sourceCode) {
    return (0, helpers_1.visitAndCountIf)(sourceCode, node => FUNCTION_NODES.includes(node.type));
}
exports.countFunctions = countFunctions;
//# sourceMappingURL=functions.js.map