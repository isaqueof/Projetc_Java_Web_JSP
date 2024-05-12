"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const core_1 = require("../core");
const decorator_1 = require("./decorator");
const helpers_1 = require("../helpers");
/**
 * Check if method with accessibility is not useless
 */
function checkAccessibility(node) {
    switch (node.accessibility) {
        case 'protected':
        case 'private':
            return false;
        case 'public':
            if (node.parent.type === 'ClassBody' &&
                'superClass' in node.parent.parent &&
                node.parent.parent.superClass) {
                return false;
            }
            break;
    }
    return true;
}
/**
 * Check if method is not useless due to typescript parameter properties and decorators
 */
function checkParams(node) {
    return !node.value.params.some(param => param.type === 'TSParameterProperty' || param.decorators?.length > 0);
}
/**
 * Check if the enclosing class is not decorated.
 */
function checkDecorator(node) {
    return !(node.parent.parent?.type === 'ClassDeclaration' && node.parent.parent.decorators?.length > 0);
}
/**
 * Check if the enclosing class does not inherit a protected constructor.
 */
function checkInheritance(node, context) {
    if (node.parent.type === 'ClassBody' &&
        'superClass' in node.parent.parent &&
        node.parent.parent.superClass) {
        const superClass = node.parent.parent.superClass;
        const variable = (0, helpers_1.getVariableFromName)(context, superClass.name);
        for (const def of variable?.defs ?? []) {
            if (def.type === 'ImportBinding') {
                return false;
            }
            if (def.node.type === 'ClassDeclaration') {
                const decl = def.node;
                if (decl.body.body.some(member => member.type === 'MethodDefinition' &&
                    member.kind === 'constructor' &&
                    member.accessibility === 'protected')) {
                    return false;
                }
            }
        }
    }
    return true;
}
const eslintNoUselessConstructor = core_1.eslintRules['no-useless-constructor'];
const originalRule = {
    meta: {
        hasSuggestions: true,
        messages: eslintNoUselessConstructor.meta.messages,
    },
    create(context) {
        const rules = eslintNoUselessConstructor.create(context);
        return {
            MethodDefinition(node) {
                if (node.value.type === 'FunctionExpression' &&
                    node.kind === 'constructor' &&
                    checkAccessibility(node) &&
                    checkParams(node) &&
                    checkDecorator(node) &&
                    checkInheritance(node, context)) {
                    rules.MethodDefinition(node);
                }
            },
        };
    },
};
exports.rule = (0, decorator_1.decorate)(originalRule);
//# sourceMappingURL=rule.js.map