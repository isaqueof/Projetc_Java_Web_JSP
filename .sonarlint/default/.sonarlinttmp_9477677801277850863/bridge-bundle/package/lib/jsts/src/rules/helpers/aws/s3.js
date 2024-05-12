"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPropagatedSetting = exports.getProperty = exports.isS3BucketDeploymentConstructor = exports.isS3BucketConstructor = exports.S3BucketTemplate = void 0;
const __1 = require("..");
const cdk_1 = require("./cdk");
/**
 * A rule template for AWS S3 Buckets
 *
 * The rule template allows to detect sensitive configuration passed on
 * the invocation of S3 Bucket's constructor from AWS CDK:
 *
 * ```new s3.Bucket(...)```
 *
 * @param callback the callback invoked on visiting S3 Bucket's instantiation
 * @param metadata the instantiated rule metadata
 * @returns the instantiated rule definition
 */
function S3BucketTemplate(callback, metadata = { meta: {} }) {
    return {
        ...metadata,
        create(context) {
            return {
                NewExpression: (node) => {
                    if (isS3BucketConstructor(context, node)) {
                        callback(node, context);
                    }
                },
            };
        },
    };
}
exports.S3BucketTemplate = S3BucketTemplate;
/**
 * Detects S3 Bucket's constructor invocation from 'aws-cdk-lib/aws-s3':
 *
 * const s3 = require('aws-cdk-lib/aws-s3');
 * new s3.Bucket();
 */
function isS3BucketConstructor(context, node) {
    return (0, cdk_1.normalizeFQN)((0, __1.getFullyQualifiedName)(context, node)) === 'aws_cdk_lib.aws_s3.Bucket';
}
exports.isS3BucketConstructor = isS3BucketConstructor;
/**
 * Detects S3 BucketDeployment's constructor invocation from 'aws-cdk-lib/aws-s3-deployment':
 *
 * const s3 = require('aws-cdk-lib/aws-s3-deployment');
 * new s3.BucketDeployment();
 */
function isS3BucketDeploymentConstructor(context, node) {
    return ((0, cdk_1.normalizeFQN)((0, __1.getFullyQualifiedName)(context, node)) ===
        'aws_cdk_lib.aws_s3_deployment.BucketDeployment');
}
exports.isS3BucketDeploymentConstructor = isS3BucketDeploymentConstructor;
/**
 * Extracts a property from the configuration argument of S3 Bucket's constructor
 *
 * ```
 * new s3.Bucket(_, _, { // config
 *  key1: value1,
 *  ...
 *  keyN: valueN
 * });
 * ```
 *
 * @param context the rule context
 * @param bucket the invocation of S3 Bucket's constructor
 * @param key the key of the property to extract
 * @returns the extracted property
 */
function getProperty(context, bucket, key) {
    const args = bucket.arguments;
    const optionsArg = args[2];
    const options = (0, __1.getValueOfExpression)(context, optionsArg, 'ObjectExpression');
    if (options == null) {
        return null;
    }
    return options.properties.find(property => (0, __1.isProperty)(property) && (0, __1.isIdentifier)(property.key, key));
}
exports.getProperty = getProperty;
/**
 * Finds the propagated setting of a sensitive property
 */
function findPropagatedSetting(sensitiveProperty, propagatedValue) {
    const propagated = { locations: [], messages: [] };
    const isPropagatedProperty = sensitiveProperty.value !== propagatedValue;
    if (isPropagatedProperty) {
        propagated.locations = [(0, __1.getNodeParent)(propagatedValue)];
        propagated.messages = ['Propagated setting.'];
    }
    return propagated;
}
exports.findPropagatedSetting = findPropagatedSetting;
//# sourceMappingURL=s3.js.map