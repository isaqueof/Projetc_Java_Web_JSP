"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const { node, ...rest } = reportDescriptor;
            const { declarations: [firstDecl, ..._], } = node;
            const varToken = context.sourceCode.getTokenBefore(firstDecl.id);
            const identifierEnd = firstDecl.id.loc.end;
            if (varToken == null) {
                // impossible
                return;
            }
            context.report({
                loc: {
                    start: varToken.loc.start,
                    end: identifierEnd,
                },
                ...rest,
            });
        }
    });
}
exports.decorate = decorate;
//# sourceMappingURL=decorator.js.map