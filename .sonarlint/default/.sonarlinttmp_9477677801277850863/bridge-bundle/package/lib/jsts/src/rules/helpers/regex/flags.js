"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlags = void 0;
const reaching_definitions_1 = require("../reaching-definitions");
const ast_1 = require("../ast");
function getFlags(callExpr, context) {
    if (callExpr.arguments.length < 2) {
        return '';
    }
    const flags = callExpr.arguments[1];
    // Matches flags in: new RegExp(pattern, 'u')
    if ((0, ast_1.isStringLiteral)(flags)) {
        return flags.value;
    }
    if (flags.type === 'Identifier' && context !== undefined) {
        // it's a variable, so we try to extract its value, but only if it's written once (const)
        const variable = (0, reaching_definitions_1.getVariableFromIdentifier)(flags, context.getScope());
        const ref = (0, ast_1.getUniqueWriteReference)(variable);
        if (ref !== undefined && (0, ast_1.isStringLiteral)(ref)) {
            return ref.value;
        }
    }
    // Matches flags with basic template literals as in: new RegExp(pattern, `u`)
    // but not: new RegExp(pattern, `${flag}`)
    // The cooked value should always be non-null in this case.
    if ((0, ast_1.isStaticTemplateLiteral)(flags) && flags.quasis[0].value.cooked != null) {
        return flags.quasis[0].value.cooked;
    }
    // Matches flags with simple raw strings as in: new RegExp(pattern, String.raw`u`)
    // but not: new RegExp(pattern, String.raw`${flag}`)
    if ((0, ast_1.isSimpleRawString)(flags)) {
        return (0, ast_1.getSimpleRawStringValue)(flags);
    }
    return null;
}
exports.getFlags = getFlags;
//# sourceMappingURL=flags.js.map