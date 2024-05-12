"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const S125_1 = require("./S125");
const S5362_1 = require("./S5362");
/**
 * The set of internal Stylelint-based rules
 */
const rules = {};
exports.rules = rules;
/**
 * Maps Stylelint rule keys to rule implementations
 */
rules[S125_1.rule.ruleName] = S125_1.rule.rule; // no-commented-code
rules[S5362_1.rule.ruleName] = S5362_1.rule.rule; // function-calc-no-invalid
//# sourceMappingURL=index.js.map