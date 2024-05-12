"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendRuleConfig = void 0;
const shared_1 = require("@sonar/shared");
const parameters_1 = require("../parameters");
/**
 * Extends an input rule configuration
 *
 * A rule configuration might be extended depending on the rule definition.
 * The purpose of the extension is to activate additional features during
 * linting, e.g., secondary locations.
 *
 * _A rule extension only applies to rules whose implementation is available._
 *
 * @param ruleModule the rule definition
 * @param inputRule the rule configuration
 * @returns the extended rule configuration
 */
function extendRuleConfig(ruleModule, inputRule) {
    const options = [...inputRule.configurations];
    if ((0, parameters_1.hasSonarRuntimeOption)(ruleModule, inputRule.key)) {
        options.push(parameters_1.SONAR_RUNTIME);
    }
    if ((0, parameters_1.hasSonarContextOption)(ruleModule, inputRule.key)) {
        options.push((0, shared_1.getContext)());
    }
    return options;
}
exports.extendRuleConfig = extendRuleConfig;
//# sourceMappingURL=rule-config.js.map