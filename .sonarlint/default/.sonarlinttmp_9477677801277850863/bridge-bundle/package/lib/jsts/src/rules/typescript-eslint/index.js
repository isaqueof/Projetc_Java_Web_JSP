"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsEslintRules = void 0;
const eslint_plugin_1 = require("@typescript-eslint/eslint-plugin");
const sanitize_1 = require("./sanitize");
/**
 * TypeScript ESLint rules that rely on type information fail at runtime because
 * they unconditionally assume that TypeScript's type checker is available.
 */
const sanitized = {};
for (const ruleKey of Object.keys(eslint_plugin_1.rules)) {
    sanitized[ruleKey] = (0, sanitize_1.sanitize)(eslint_plugin_1.rules[ruleKey]);
}
/**
 * TypeScript ESLint rules.
 */
exports.tsEslintRules = sanitized;
//# sourceMappingURL=index.js.map