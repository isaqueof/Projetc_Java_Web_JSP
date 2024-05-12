"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCpdTokens = void 0;
const visitor_1 = require("./visitor");
/**
 * Extracts the copy-paste detector (cpd) tokens
 * @param sourceCode the source code to extract from
 * @returns the cpd tokens
 */
function getCpdTokens(sourceCode) {
    const cpdTokens = [];
    const tokens = sourceCode.ast.tokens;
    const { jsxTokens, importTokens, requireTokens } = extractTokens(sourceCode);
    tokens.forEach(token => {
        let text = token.value;
        if (text.trim().length === 0) {
            // for EndOfFileToken and JsxText tokens containing only whitespaces
            return;
        }
        if (importTokens.includes(token)) {
            // for tokens from import statements
            return;
        }
        if (requireTokens.includes(token)) {
            // for tokens from require statements
            return;
        }
        if (isStringLiteralToken(token) && !jsxTokens.includes(token)) {
            text = 'LITERAL';
        }
        const startPosition = token.loc.start;
        const endPosition = token.loc.end;
        cpdTokens.push({
            location: {
                startLine: startPosition.line,
                startCol: startPosition.column,
                endLine: endPosition.line,
                endCol: endPosition.column,
            },
            image: text,
        });
    });
    return { cpdTokens };
}
exports.getCpdTokens = getCpdTokens;
/**
 * Extracts specific tokens to be ignored by copy-paste detection
 * @param sourceCode the source code to extract from
 * @returns a list of tokens to be ignored
 */
function extractTokens(sourceCode) {
    const jsxTokens = [];
    const importTokens = [];
    const requireTokens = [];
    (0, visitor_1.visit)(sourceCode, (node) => {
        const tsNode = node;
        switch (tsNode.type) {
            case 'JSXAttribute':
                if (tsNode.value?.type === 'Literal') {
                    jsxTokens.push(...sourceCode.getTokens(tsNode.value));
                }
                break;
            case 'ImportDeclaration':
                importTokens.push(...sourceCode.getTokens(tsNode));
                break;
            case 'CallExpression':
                if (tsNode.callee.type === 'Identifier' && tsNode.callee.name === 'require') {
                    requireTokens.push(...sourceCode.getTokens(tsNode));
                }
                break;
        }
    });
    return { jsxTokens, importTokens, requireTokens };
}
function isStringLiteralToken(token) {
    return token.value.startsWith('"') || token.value.startsWith("'") || token.value.startsWith('`');
}
//# sourceMappingURL=cpd.js.map