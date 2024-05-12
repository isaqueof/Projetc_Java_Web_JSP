"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const symbol_highlighting_1 = require("../visitors/symbol-highlighting");
/**
 * The internal _symbol highlighting_ custom rule
 */
exports.rule = {
    ruleId: 'internal-symbol-highlighting',
    ruleModule: symbol_highlighting_1.rule,
    ruleConfig: [],
};
//# sourceMappingURL=symbol-highlighting.js.map