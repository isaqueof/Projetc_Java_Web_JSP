"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorate = void 0;
const helpers_1 = require("../helpers");
function decorate(rule) {
    return (0, helpers_1.interceptReport)(rule, (context, descriptor) => {
        const { node } = descriptor;
        const moduleKeyword = context.sourceCode.getFirstToken(node, token => token.value === 'module');
        if (moduleKeyword?.loc) {
            context.report({ ...descriptor, loc: moduleKeyword.loc });
        }
        else {
            context.report(descriptor);
        }
    });
}
exports.decorate = decorate;
//# sourceMappingURL=decorator.js.map