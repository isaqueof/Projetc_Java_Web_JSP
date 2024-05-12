"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickResourceName = exports.serverlessParsingContext = exports.lambdaParsingContext = void 0;
exports.lambdaParsingContext = {
    predicate: isInlineAwsLambda,
    picker: pickResourceName.bind(null, 6),
};
exports.serverlessParsingContext = {
    predicate: isInlineAwsServerless,
    picker: pickResourceName.bind(null, 4),
};
/**
 * Checks if the given YAML AST node is an AWS Lambda function with the following structure:
 *
 * SomeLambdaFunction:
 *   Type: "AWS::Lambda::Function"
 *   Properties:
 *     Runtime: <nodejs-version>
 *     Code:
 *       ZipFile: <embedded-js-code>
 */
function isInlineAwsLambda(_key, pair, ancestors) {
    return (isZipFile(pair) &&
        hasCode(ancestors) &&
        hasNodeJsRuntime(ancestors) &&
        hasType(ancestors, 'AWS::Lambda::Function'));
    function isZipFile(pair) {
        return pair.key.value === 'ZipFile';
    }
    function hasCode(ancestors, level = 2) {
        return ancestors[ancestors.length - level]?.key?.value === 'Code';
    }
}
/**
 * Checks if the given YAML AST node is an AWS Serverless function with the following structure:
 *
 * SomeServerlessFunction:
 *   Type: "AWS::Serverless::Function"
 *   Properties:
 *     Runtime: <nodejs-version>
 *     InlineCode: <embedded-js-code>
 */
function isInlineAwsServerless(_key, pair, ancestors) {
    return (isInlineCode(pair) &&
        hasNodeJsRuntime(ancestors, 1) &&
        hasType(ancestors, 'AWS::Serverless::Function', 3));
    /**
     * We need to check the pair directly instead of ancestors,
     * otherwise it will validate all siblings.
     */
    function isInlineCode(pair) {
        return pair.key.value === 'InlineCode';
    }
}
function hasNodeJsRuntime(ancestors, level = 3) {
    return ancestors[ancestors.length - level]?.items?.some((item) => item?.key.value === 'Runtime' && item?.value?.value.startsWith('nodejs'));
}
function hasType(ancestors, value, level = 5) {
    return ancestors[ancestors.length - level]?.items?.some((item) => item?.key.value === 'Type' && item?.value.value === value);
}
/**
 * Picks the embeddedJS resource name for AWS lambdas and serverless functions
 */
function pickResourceName(level, _key, _pair, ancestors) {
    const ancestorsAtResourcesLevel = ancestors[ancestors.length - level];
    return {
        resourceName: ancestorsAtResourcesLevel.key.value,
    };
}
exports.pickResourceName = pickResourceName;
//# sourceMappingURL=parsingContexts.js.map