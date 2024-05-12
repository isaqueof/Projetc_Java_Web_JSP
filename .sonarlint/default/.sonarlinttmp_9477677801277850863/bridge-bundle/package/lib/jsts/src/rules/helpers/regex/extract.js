"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatternFromNode = exports.getParsedRegex = void 0;
const regexpp = __importStar(require("@eslint-community/regexpp"));
const __1 = require("../");
const ast_1 = require("./ast");
const flags_1 = require("./flags");
function getParsedRegex(node, context) {
    const patternAndFlags = getPatternFromNode(node, context);
    if (patternAndFlags) {
        try {
            return regexpp.parseRegExpLiteral(new RegExp(patternAndFlags.pattern, patternAndFlags.flags));
        }
        catch {
            // do nothing for invalid regex
        }
    }
    return null;
}
exports.getParsedRegex = getParsedRegex;
function getPatternFromNode(node, context) {
    if ((0, ast_1.isRegExpConstructor)(node)) {
        const patternOnly = getPatternFromNode(node.arguments[0], context);
        const flags = (0, flags_1.getFlags)(node, context);
        if (patternOnly && flags !== null) {
            // if we can't extract flags correctly, we skip this
            // to avoid FPs
            return { pattern: patternOnly.pattern, flags };
        }
    }
    else if ((0, __1.isRegexLiteral)(node)) {
        return node.regex;
    }
    else if ((0, __1.isStringLiteral)(node)) {
        return { pattern: node.value, flags: '' };
    }
    else if ((0, __1.isStaticTemplateLiteral)(node)) {
        return { pattern: node.quasis[0].value.raw, flags: '' };
    }
    else if ((0, __1.isSimpleRawString)(node)) {
        return { pattern: (0, __1.getSimpleRawStringValue)(node), flags: '' };
    }
    else if ((0, __1.isIdentifier)(node)) {
        const assignedExpression = (0, __1.getUniqueWriteUsage)(context, node.name);
        if (assignedExpression &&
            assignedExpression.parent?.type === 'VariableDeclarator') {
            return getPatternFromNode(assignedExpression, context);
        }
    }
    else if ((0, __1.isBinaryPlus)(node)) {
        const left = getPatternFromNode(node.left, context);
        const right = getPatternFromNode(node.right, context);
        if (left && right) {
            return { pattern: left.pattern + right.pattern, flags: '' };
        }
    }
    return null;
}
exports.getPatternFromNode = getPatternFromNode;
//# sourceMappingURL=extract.js.map