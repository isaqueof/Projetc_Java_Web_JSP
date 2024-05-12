"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
// core implementation of this rule raises false positives for generators
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(isReferencedInsideGenerators));
}
exports.decorate = decorate;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const node = reportDescriptor['node'];
            if (!exemptionCondition(context, node)) {
                context.report(reportDescriptor);
            }
        }
    };
}
function isReferencedInsideGenerators(context, node) {
    const variable = (0, helpers_1.getVariableFromName)(context, node.name);
    if (variable) {
        for (const reference of variable.references) {
            let scope = reference.from;
            while (scope !== null && !scope.variables.includes(variable)) {
                if (isGenerator(scope.block)) {
                    return true;
                }
                scope = scope.upper;
            }
        }
    }
    return false;
    function isGenerator(node) {
        return ((node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') &&
            node.generator === true);
    }
}
//# sourceMappingURL=decorator.js.map