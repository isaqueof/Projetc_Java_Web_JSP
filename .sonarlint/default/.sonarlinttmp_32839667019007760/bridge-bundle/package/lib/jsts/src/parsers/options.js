"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildParserOptions = void 0;
/**
 * Builds ESLint parser options
 *
 * ESLint parser options allows for customizing the behaviour of
 * the ESLint-based parser used to parse JavaScript or TypeScript
 * code. It configures the ECMAScript version, specific syntax or
 * features to consider as valid during parsing, and additional
 * contents in the abstract syntax tree, among other things.
 *
 * @param initialOptions the analysis options to use
 * @param usingBabel a flag to indicate if we intend to parse with Babel
 * @returns the parser options for the input
 */
function buildParserOptions(initialOptions, usingBabel = false) {
    const options = {
        tokens: true,
        comment: true,
        loc: true,
        range: true,
        ecmaVersion: 2018,
        sourceType: 'module',
        codeFrame: false,
        ecmaFeatures: {
            jsx: true,
            globalReturn: false,
            legacyDecorators: true,
        },
        // for Vue parser
        extraFileExtensions: ['.vue'],
        ...initialOptions,
    };
    if (usingBabel) {
        return babelParserOptions(options);
    }
    return options;
}
exports.buildParserOptions = buildParserOptions;
/**
 * Extends parser options with Babel's specific options
 *
 * Babel's parser is able to parse non-standard syntaxes and features.
 * However, the support of such constructs are extracted into dedicated
 * plugins, which need to be explictly included in the parser options,
 * among other things.
 *
 * @param options the parser options to extend
 * @returns the extend parser options
 */
function babelParserOptions(options) {
    const pluginPath = `${__dirname}/../../../../node_modules`;
    const babelOptions = {
        targets: 'defaults',
        presets: [
            `${pluginPath}/@babel/preset-react`,
            `${pluginPath}/@babel/preset-flow`,
            `${pluginPath}/@babel/preset-env`,
        ],
        plugins: [[`${pluginPath}/@babel/plugin-proposal-decorators`, { version: '2022-03' }]],
        babelrc: false,
        configFile: false,
        parserOpts: {
            allowReturnOutsideFunction: true,
        },
    };
    return { ...options, requireConfigFile: false, babelOptions };
}
//# sourceMappingURL=options.js.map