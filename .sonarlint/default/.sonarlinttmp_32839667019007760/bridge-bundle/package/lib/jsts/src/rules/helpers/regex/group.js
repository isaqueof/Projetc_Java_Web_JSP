"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractReferences = void 0;
const __1 = require("../");
function extractReferences(node) {
    const references = [];
    if ((0, __1.isStringLiteral)(node)) {
        const str = node.value;
        const reg = /\$(\d+)|\$<([a-zA-Z]\w*)>/g;
        let match;
        while ((match = reg.exec(str)) !== null) {
            const [raw, index, name] = match;
            const value = index || name;
            references.push({ raw, value });
        }
    }
    return references;
}
exports.extractReferences = extractReferences;
//# sourceMappingURL=group.js.map