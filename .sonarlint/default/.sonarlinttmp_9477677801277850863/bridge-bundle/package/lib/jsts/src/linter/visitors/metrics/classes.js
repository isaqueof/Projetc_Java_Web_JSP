"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countClasses = void 0;
const helpers_1 = require("./helpers");
/**
 * The ESLint class node types
 */
const CLASS_NODES = ['ClassDeclaration', 'ClassExpression'];
/**
 * Computes the number of classes in the source code
 */
function countClasses(sourceCode) {
    return (0, helpers_1.visitAndCountIf)(sourceCode, node => CLASS_NODES.includes(node.type));
}
exports.countClasses = countClasses;
//# sourceMappingURL=classes.js.map