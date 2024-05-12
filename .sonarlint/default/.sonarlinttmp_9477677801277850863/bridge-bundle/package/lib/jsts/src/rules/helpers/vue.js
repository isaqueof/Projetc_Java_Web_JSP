"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInsideVueSetupScript = void 0;
function isVueSetupScript(element) {
    return (element.type === 'VElement' &&
        element.name === 'script' &&
        !!element.startTag.attributes.find(attr => attr.key.name === 'setup'));
}
function isInsideVueSetupScript(node, ctx) {
    const doc = ctx.parserServices?.getDocumentFragment?.();
    const setupScript = doc?.children.find(isVueSetupScript);
    return (!!setupScript &&
        !!node.range &&
        setupScript.range[0] <= node.range[0] &&
        setupScript.range[1] >= node.range[1]);
}
exports.isInsideVueSetupScript = isInsideVueSetupScript;
//# sourceMappingURL=vue.js.map