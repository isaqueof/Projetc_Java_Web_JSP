"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sinon = void 0;
const _1 = require(".");
var Sinon;
(function (Sinon) {
    function isImported(context) {
        return ((0, _1.getRequireCalls)(context).some(r => r.arguments[0].type === 'Literal' && r.arguments[0].value === 'sinon') || (0, _1.getImportDeclarations)(context).some(i => i.source.value === 'sinon'));
    }
    Sinon.isImported = isImported;
    function isAssertion(context, node) {
        return isAssertUsage(context, node);
    }
    Sinon.isAssertion = isAssertion;
    function isAssertUsage(context, node) {
        // assert.<expr>(), sinon.assert.<expr>()
        const fqn = extractFQNforCallExpression(context, node);
        if (!fqn) {
            return false;
        }
        const names = fqn.split('.');
        return names.length === 3 && names[0] === 'sinon' && names[1] === 'assert';
    }
    function extractFQNforCallExpression(context, node) {
        if (node.type !== 'CallExpression') {
            return undefined;
        }
        return (0, _1.getFullyQualifiedName)(context, node);
    }
})(Sinon || (exports.Sinon = Sinon = {}));
//# sourceMappingURL=sinon.js.map