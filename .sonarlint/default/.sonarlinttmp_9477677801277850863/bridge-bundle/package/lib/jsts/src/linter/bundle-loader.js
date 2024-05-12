"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBundles = exports.loadCustomRules = void 0;
const core_1 = require("../rules/core");
const typescript_eslint_1 = require("../rules/typescript-eslint");
const eslint_plugin_sonarjs_1 = require("eslint-plugin-sonarjs");
const eslint_plugin_react_1 = require("eslint-plugin-react");
const eslint_plugin_jsx_a11y_1 = require("eslint-plugin-jsx-a11y");
const eslint_plugin_import_1 = require("eslint-plugin-import");
const rules_1 = require("../rules");
const custom_rules_1 = require("./custom-rules");
const shared_1 = require("@sonar/shared");
function loadCustomRules(linter, rules = []) {
    for (const rule of rules) {
        linter.defineRule(rule.ruleId, rule.ruleModule);
    }
}
exports.loadCustomRules = loadCustomRules;
function loadBundles(linter, rulesBundles) {
    for (const bundleId of rulesBundles) {
        loaders[bundleId](linter);
    }
}
exports.loadBundles = loadBundles;
/**
 * Loaders for each of the predefined rules bundles. Each bundle comes with a
 * different data structure (array/record/object).
 */
const loaders = {
    /**
     * Loads external rules
     *
     * The external ESLint-based rules include all the rules that are
     * not implemented internally, in other words, rules from external
     * dependencies which include ESLint core rules.
     */
    externalRules(linter) {
        const externalRules = {};
        /**
         * The order of defining rules from external dependencies is important here.
         * Core ESLint rules could be overridden by the implementation from specific
         * dependencies, which should be the default behaviour in most cases.
         */
        const dependencies = [
            core_1.eslintRules,
            typescript_eslint_1.tsEslintRules,
            eslint_plugin_react_1.rules,
            eslint_plugin_jsx_a11y_1.rules,
            eslint_plugin_import_1.rules,
        ];
        for (const dependencyRules of dependencies) {
            for (const [name, module] of Object.entries(dependencyRules)) {
                externalRules[name] = module;
            }
        }
        linter.defineRules(externalRules);
    },
    /**
     * Loads plugin rules
     *
     * Adds the rules from the Sonar ESLint plugin.
     */
    pluginRules(linter) {
        linter.defineRules(eslint_plugin_sonarjs_1.rules);
    },
    /**
     * Loads internal rules
     *
     * Adds the rules from SonarJS plugin, i.e. rules in path
     * /src/rules
     */
    internalRules(linter) {
        linter.defineRules(rules_1.rules);
    },
    /**
     * Loads global context rules
     *
     * Context bundles define a set of external custom rules (like the taint analysis rule)
     * including rule keys and rule definitions that cannot be provided to the linter
     * wrapper using the same feeding channel as rules from the active quality profile.
     */
    contextRules(linter) {
        const { bundles } = (0, shared_1.getContext)();
        const customRules = [];
        for (const ruleBundle of bundles) {
            const bundle = require(ruleBundle);
            customRules.push(...bundle.rules);
            const ruleIds = bundle.rules.map((r) => r.ruleId);
            (0, shared_1.debug)(`Loaded rules ${ruleIds} from ${ruleBundle}`);
        }
        loadCustomRules(linter, customRules);
    },
    /**
     * Loads internal custom rules
     *
     * These are rules used internally by SonarQube to have the symbol highlighting and
     * the cognitive complexity metrics.
     */
    internalCustomRules(linter) {
        loadCustomRules(linter, custom_rules_1.customRules);
    },
};
//# sourceMappingURL=bundle-loader.js.map