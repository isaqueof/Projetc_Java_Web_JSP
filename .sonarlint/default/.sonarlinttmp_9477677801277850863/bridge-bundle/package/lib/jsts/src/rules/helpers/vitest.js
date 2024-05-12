"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vitest = void 0;
const _1 = require(".");
var Vitest;
(function (Vitest) {
    function isImported(context) {
        return ((0, _1.getRequireCalls)(context).some(r => r.arguments[0].type === 'Literal' && r.arguments[0].value === 'vitest') || (0, _1.getImportDeclarations)(context).some(i => i.source.value === 'vitest'));
    }
    Vitest.isImported = isImported;
    function isAssertion(context, node) {
        return isExpectUsage(context, node);
    }
    Vitest.isAssertion = isAssertion;
    function isExpectUsage(context, node) {
        // expect(), vitest.expect()
        return extractFQNforCallExpression(context, node) === 'vitest.expect';
    }
    function extractFQNforCallExpression(context, node) {
        if (node.type !== 'CallExpression') {
            return undefined;
        }
        return (0, _1.getFullyQualifiedName)(context, node);
    }
})(Vitest || (exports.Vitest = Vitest = {}));
//# sourceMappingURL=vitest.js.map