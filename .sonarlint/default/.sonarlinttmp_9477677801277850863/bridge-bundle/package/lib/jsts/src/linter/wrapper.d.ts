import { Linter, SourceCode } from 'eslint';
import { RuleConfig } from './config';
import { FileType, JsTsLanguage } from '@sonar/shared';
import { LintingResult } from './issues';
import { CustomRule } from './custom-rules';
/**
 * Wrapper's constructor initializer. All the parameters are optional,
 * having the option to create a Linter without any additional rules
 * loaded, aside of the preexisting ESLint core rules.
 *
 * @param inputRules the quality profile rules, enabled rules
 * @param environments the JavaScript environments
 * @param globals the global variables
 * @param ruleBundles the bundles of rules to load in the linter
 * @param customRules array of rules to load in the linter
 */
export interface WrapperOptions {
    inputRules?: RuleConfig[];
    environments?: string[];
    globals?: string[];
    ruleBundles?: string[];
    customRules?: CustomRule[];
}
interface LinterConfigurationKey {
    language: JsTsLanguage;
    fileType: FileType;
}
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
export declare class LinterWrapper {
    private readonly options;
    /** The wrapper's internal ESLint linter instance */
    readonly linter: Linter;
    /** The wrapper's linting configuration */
    readonly config: Map<LinterConfigurationKey, Linter.Config>;
    readonly configurationKeys: LinterConfigurationKey[];
    private linterConfigurationKey;
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
    constructor(options?: WrapperOptions);
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
    lint(sourceCode: SourceCode, filePath: string, fileType?: FileType, language?: JsTsLanguage): LintingResult;
    /**
     * Creates the wrapper's linting configuration
     *
     * The wrapper's linting configuration actually includes two
     * ESLint configurations: one per file type.
     *
     * @returns the wrapper's linting configuration
     */
    private createConfig;
    getConfig(key: LinterConfigurationKey): Linter.Config<Linter.RulesRecord, Linter.RulesRecord> | undefined;
}
export {};
