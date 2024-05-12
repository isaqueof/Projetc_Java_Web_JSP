"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinterWrapper = void 0;
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
const eslint_1 = require("eslint");
const bundle_loader_1 = require("./bundle-loader");
const config_1 = require("./config");
const shared_1 = require("@sonar/shared");
const issues_1 = require("./issues");
/**
 * When a linter is created, by default all these bundles of rules will
 * be loaded into the linter internal rules map. This behaviour can be
 * adjusted by passing which bundles, if any, should be loaded instead.
 * The order of this array is important here. Rules from a previous bundle
 * will be overridden by the implementation of the same rule key in a
 * subsequent bundle.
 */
const defaultRuleBundles = [
    'externalRules',
    'pluginRules',
    'internalRules',
    'contextRules',
    'internalCustomRules',
];
/**
 * A wrapper of ESLint linter
 *
 * The purpose of the wrapper is to configure the behaviour of ESLint linter,
 * which includes:
 *
 * - defining the rules that should be used during linting,
 * - declaring globals that need to be considered as such
 * - defining the environments bringing a set of predefined variables
 *
 * Because some rules target main files while other target test files (or even
 * both), the wrapper relies on two linting configurations to decide which set
 * of rules should be considered during linting.
 *
 * Last but not least, the linter wrapper eventually turns ESLint problems,
 * also known as messages, into SonarQube issues.
 */
class LinterWrapper {
    linterConfigurationKey(key) {
        const r = this.configurationKeys.find(v => v.language === key.language && v.fileType === key.fileType);
        if (r) {
            return r;
        }
        else {
            this.configurationKeys.push(key);
            return key;
        }
    }
    /**
     * Constructs an ESLint linter wrapper
     *
     * Constructing a linter wrapper consists in building the rule database
     * the internal ESLint linter shall consider during linting. Furthermore,
     * it creates a linting configuration that configures which rules should
     * be used on linting based on the active quality profile and file type.
     *
     * The order of defining rules is important here because internal rules
     * and external ones might share the same name by accident, which would
     * unexpectedly overwrite the behaviour of the internal one in favor of
     * the external one. This is why some internal rules are named with the
     * prefix `sonar-`, e.g., `sonar-no-fallthrough`.
     *
     * @param options the wrapper's options
     */
    constructor(options = {}) {
        this.options = options;
        this.configurationKeys = [];
        this.linter = new eslint_1.Linter();
        (0, bundle_loader_1.loadBundles)(this.linter, options.ruleBundles ?? defaultRuleBundles);
        (0, bundle_loader_1.loadCustomRules)(this.linter, options.customRules);
        this.config = this.createConfig();
    }
    /**
     * Lints an ESLint source code instance
     *
     * Linting a source code implies using ESLint linting functionality to find
     * problems in the code. It selects which linting configuration needs to be
     * considered during linting based on the file type.
     *
     * @param sourceCode the ESLint source code
     * @param filePath the path of the source file
     * @param fileType the type of the source file
     * @param language language of the source file
     * @returns the linting result
     */
    lint(sourceCode, filePath, fileType = 'MAIN', language = 'js') {
        const key = { fileType, language };
        let linterConfig = this.getConfig(key);
        if (!linterConfig) {
            // we create default linter config with internal rules only which provide metrics, tokens, etc...
            linterConfig = (0, config_1.createLinterConfig)([], this.linter.getRules(), this.options.environments, this.options.globals);
            this.config.set(key, linterConfig);
        }
        const config = { ...linterConfig, settings: { ...linterConfig.settings, fileType } };
        const options = { filename: filePath, allowInlineConfig: false };
        const messages = this.linter.verify(sourceCode, config, options);
        return (0, issues_1.transformMessages)(messages, { sourceCode, rules: this.linter.getRules() });
    }
    /**
     * Creates the wrapper's linting configuration
     *
     * The wrapper's linting configuration actually includes two
     * ESLint configurations: one per file type.
     *
     * @returns the wrapper's linting configuration
     */
    createConfig() {
        (0, shared_1.debug)('Creating linter config');
        const rulesByKey = new Map();
        this.options.inputRules?.forEach(r => {
            const target = Array.isArray(r.fileTypeTarget) ? r.fileTypeTarget : [r.fileTypeTarget];
            target.forEach(fileType => {
                const key = this.linterConfigurationKey({ language: r.language ?? 'js', fileType });
                const rules = rulesByKey.get(key) ?? [];
                rules.push(r);
                rulesByKey.set(key, rules);
            });
        });
        rulesByKey.forEach((rules, key) => {
            (0, shared_1.debug)(`Linter config: ${JSON.stringify(key)} with ${rules
                .map(r => r.key)
                .sort((a, b) => a.localeCompare(b))}`);
        });
        const configByKey = new Map();
        const linterRules = this.linter.getRules();
        rulesByKey.forEach((rules, key) => {
            configByKey.set(key, (0, config_1.createLinterConfig)(rules, linterRules, this.options.environments, this.options.globals));
        });
        return configByKey;
    }
    getConfig(key) {
        const k = this.linterConfigurationKey(key);
        return this.config.get(k);
    }
}
exports.LinterWrapper = LinterWrapper;
//# sourceMappingURL=wrapper.js.map