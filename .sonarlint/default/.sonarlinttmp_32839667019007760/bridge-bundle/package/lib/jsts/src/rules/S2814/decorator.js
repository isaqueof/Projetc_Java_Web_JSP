"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
// core implementation of this rule raises issues on type exports
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(isTypeDeclaration));
}
exports.decorate = decorate;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const node = reportDescriptor['node'];
            if (node.type === 'Identifier' && !exemptionCondition(node)) {
                context.report(reportDescriptor);
            }
        }
    };
}
function isTypeDeclaration(node) {
    return node.parent?.type === 'TSTypeAliasDeclaration';
}
//# sourceMappingURL=decorator.js.map