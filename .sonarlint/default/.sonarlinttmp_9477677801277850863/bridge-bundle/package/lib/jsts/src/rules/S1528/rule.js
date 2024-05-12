"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    meta: {
        hasSuggestions: true,
    },
    create(context) {
        function checkNewExpression(node) {
            const newExpression = node;
            if (newExpression.callee.type === 'Identifier' && newExpression.callee.name === 'Array') {
                let message = 'Use either a literal or "Array.from()" instead of the "Array" constructor.';
                let suggest = [
                    {
                        desc: 'Replace with a literal',
                        fix: replaceWithLiteralFix(newExpression, context),
                    },
                ];
                if (newExpression.arguments.length === 1 &&
                    newExpression.arguments[0].type === 'Literal' &&
                    typeof newExpression.arguments[0].value === 'number') {
                    message = 'Use "Array.from()" instead of the "Array" constructor.';
                }
                if (newExpression.arguments.length === 1) {
                    suggest = [
                        {
                            desc: 'Replace with "Array.from()"',
                            fix: replaceWithArrayFromFix(newExpression, context),
                        },
                    ];
                }
                context.report({ node, message, suggest });
            }
        }
        return {
            NewExpression: checkNewExpression,
        };
    },
};
function replaceWithLiteralFix(newExpression, context) {
    const argText = newExpression.arguments
        .map((arg) => context.sourceCode.getText(arg))
        .join(', ');
    return fixer => fixer.replaceText(newExpression, `[${argText}]`);
}
function replaceWithArrayFromFix(newExpression, context) {
    const argText = context.sourceCode.getText(newExpression.arguments[0]);
    return fixer => fixer.replaceText(newExpression, `Array.from({length: ${argText}})`);
}
//# sourceMappingURL=rule.js.map