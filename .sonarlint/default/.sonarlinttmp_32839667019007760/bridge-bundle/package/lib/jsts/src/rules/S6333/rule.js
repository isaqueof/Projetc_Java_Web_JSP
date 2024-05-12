"use strict";
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
// https://sonarsource.github.io/rspec/#/rspec/S6333/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const cdk_1 = require("../helpers/aws/cdk");
const result_1 = require("../helpers/result");
const helpers_1 = require("../helpers");
const REST_API_PROPERTIES_POSITION = 2;
const RESOURCE_ADD_RESOURCE_PROPERTIES_POSITION = 1;
const RESOURCE_ADD_METHOD_POSITION = 2;
const REST_API_ROOT_PROPERTY = 'root';
const DEFAULT_METHOD_OPTIONS = 'defaultMethodOptions';
const AUTHORIZATION_TYPE = 'authorizationType';
const NONE_AUTHORIZATION_TYPE = 'aws_cdk_lib.aws_apigateway.AuthorizationType.NONE';
const ADD_METHOD = 'addMethod';
const ADD_RESOURCE = 'addResource';
const GET_RESOURCE = 'getResource';
const PARENT_RESOURCE = 'parentResource';
const messages = {
    publicApi: 'Make sure that creating public APIs is safe here.',
    omittedAuthorizationType: 'Omitting "authorizationType" disables authentication. Make sure it is safe here.',
};
const apigatewayChecker = (0, cdk_1.AwsCdkCheckArguments)(['omittedAuthorizationType', 'publicApi'], true, AUTHORIZATION_TYPE, { primitives: { invalid: ['NONE'] } });
function consumersFactory(ctx) {
    const defaultAuthorizationTypes = new Map();
    const restApiDefaultCollector = defaultsCollector(REST_API_PROPERTIES_POSITION);
    const resourceDefaultCollector = defaultsCollector(RESOURCE_ADD_RESOURCE_PROPERTIES_POSITION);
    return {
        'aws_cdk_lib.aws_apigateway.CfnMethod': apigatewayChecker,
        'aws_cdk_lib.aws_apigatewayv2.CfnRoute': apigatewayChecker,
        'aws_cdk_lib.aws_apigateway.RestApi': restApiDefaultCollector,
        'aws_cdk_lib.aws_apigateway.RestApi.root': {
            methods: [ADD_METHOD, ADD_RESOURCE, GET_RESOURCE, PARENT_RESOURCE],
            callExpression: (expr, _ctx, fqn) => {
                if (fqn.endsWith(ADD_METHOD)) {
                    checkResourceMethod(expr);
                }
                else if (fqn.endsWith(ADD_RESOURCE)) {
                    resourceDefaultCollector(expr);
                }
            },
        },
    };
    function checkResourceMethod(expr) {
        const properties = (0, result_1.getResultOfExpression)(ctx, expr).getArgument(RESOURCE_ADD_METHOD_POSITION);
        const authorizationType = properties.getProperty(AUTHORIZATION_TYPE);
        if (authorizationType.isFound && isSensitiveAuthorizationType(authorizationType.node)) {
            ctx.report({
                messageId: 'publicApi',
                node: authorizationType.node,
            });
        }
        else if (authorizationType.isMissing) {
            const defaultAuthorizationType = getDefaultAuthorizationType(expr.callee);
            if (defaultAuthorizationType == null) {
                ctx.report({
                    messageId: 'omittedAuthorizationType',
                    node: authorizationType.node,
                });
            }
            else if (isSensitiveAuthorizationType(defaultAuthorizationType)) {
                ctx.report({
                    messageId: 'publicApi',
                    node: expr,
                });
            }
        }
    }
    function getDefaultAuthorizationType(node) {
        const resource = (0, helpers_1.getUniqueWriteUsageOrNode)(ctx, node);
        if (defaultAuthorizationTypes.has(resource)) {
            return defaultAuthorizationTypes.get(resource);
        }
        else if (isDefaultFromCallee(resource)) {
            return getDefaultAuthorizationType(resource.callee);
        }
        else if (isDefaultFromObject(resource, ADD_METHOD, ADD_RESOURCE, REST_API_ROOT_PROPERTY)) {
            return getDefaultAuthorizationType(resource.object);
        }
        else {
            return undefined;
        }
    }
    function defaultsCollector(position) {
        return (expr) => {
            const properties = (0, result_1.getResultOfExpression)(ctx, expr).getArgument(position);
            const defaultMethodOptions = properties.getProperty(DEFAULT_METHOD_OPTIONS);
            const authorizationType = defaultMethodOptions.getProperty(AUTHORIZATION_TYPE);
            if (authorizationType.isFound) {
                defaultAuthorizationTypes.set(expr, authorizationType.node);
            }
        };
    }
    function isSensitiveAuthorizationType(node) {
        const fqn = (0, cdk_1.normalizeFQN)((0, helpers_1.getFullyQualifiedName)(ctx, node));
        return fqn === NONE_AUTHORIZATION_TYPE;
    }
}
function isDefaultFromObject(node, ...names) {
    return node.type === 'MemberExpression' && names.some(name => (0, helpers_1.isMemberWithProperty)(node, name));
}
function isDefaultFromCallee(node) {
    return node.type === 'CallExpression' && (0, helpers_1.isMethodCall)(node);
}
exports.rule = (0, cdk_1.AwsCdkTemplate)(consumersFactory, { meta: { messages } });
//# sourceMappingURL=rule.js.map