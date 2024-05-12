"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findExecutableLines = void 0;
const __1 = require("../");
/**
 * The ESLint executable node types
 */
const EXECUTABLE_NODES = [
    'ExpressionStatement',
    'IfStatement',
    'LabeledStatement',
    'BreakStatement',
    'ContinueStatement',
    'WithStatement',
    'SwitchStatement',
    'ReturnStatement',
    'ThrowStatement',
    'TryStatement',
    'WhileStatement',
    'DoWhileStatement',
    'ForStatement',
    'ForInStatement',
    'DebuggerStatement',
    'VariableDeclaration',
    'ForOfStatement',
];
/**
 * Finds the line numbers of executable lines in the source code
 */
function findExecutableLines(sourceCode) {
    const lines = new Set();
    (0, __1.visit)(sourceCode, node => {
        if (EXECUTABLE_NODES.includes(node.type) && node.loc) {
            lines.add(node.loc.start.line);
        }
    });
    return Array.from(lines).sort((a, b) => a - b);
}
exports.findExecutableLines = findExecutableLines;
//# sourceMappingURL=executable-lines.js.map