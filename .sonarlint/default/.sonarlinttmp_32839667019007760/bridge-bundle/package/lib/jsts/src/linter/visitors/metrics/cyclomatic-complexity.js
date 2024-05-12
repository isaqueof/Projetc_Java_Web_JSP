"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeCyclomaticComplexity = void 0;
const __1 = require("../");
/**
 * The ESLint loop node types
 */
const LOOP_NODES = [
    'ForStatement',
    'ForInStatement',
    'ForOfStatement',
    'WhileStatement',
    'DoWhileStatement',
];
/**
 * The ESLint conditional node types
 */
const CONDITIONAL_NODES = ['IfStatement', 'ConditionalExpression', 'SwitchCase'];
/**
 * The ESLint function node types
 */
const FUNCTION_NODES = ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'];
/**
 * The ESLint node types increasing complexity
 */
const COMPLEXITY_NODES = [
    ...CONDITIONAL_NODES,
    ...FUNCTION_NODES,
    ...LOOP_NODES,
    'LogicalExpression',
];
/**
 * Computes the cyclomatic complexity of an ESLint source code
 * @param sourceCode the ESLint source code
 * @returns the cyclomatic complexity
 */
function computeCyclomaticComplexity(sourceCode) {
    let complexity = 0;
    (0, __1.visit)(sourceCode, node => {
        if (COMPLEXITY_NODES.includes(node.type)) {
            complexity++;
        }
    });
    return complexity;
}
exports.computeCyclomaticComplexity = computeCyclomaticComplexity;
//# sourceMappingURL=cyclomatic-complexity.js.map