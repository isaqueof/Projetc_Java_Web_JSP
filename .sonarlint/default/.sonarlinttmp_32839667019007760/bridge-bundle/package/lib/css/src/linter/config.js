"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStylelintConfig = void 0;
/**
 * Creates a Stylelint configuration
 *
 * Creating a Stylelint configuration implies enabling along with specific rule
 * configuration all the rules from the active quality profile.
 *
 * @param rules the rules from the active quality profile
 * @returns the created Stylelint configuration
 */
function createStylelintConfig(rules) {
    const configRules = {};
    for (const { key, configurations } of rules) {
        if (configurations.length === 0) {
            configRules[key] = true;
        }
        else {
            configRules[key] = configurations;
        }
    }
    return { customSyntax: 'postcss-syntax', rules: configRules };
}
exports.createStylelintConfig = createStylelintConfig;
//# sourceMappingURL=config.js.map