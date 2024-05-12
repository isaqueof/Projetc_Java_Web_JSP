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
// https://sonarsource.github.io/rspec/#/rspec/S6329/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const cdk_1 = require("../helpers/aws/cdk");
const result_1 = require("../helpers/result");
const helpers_1 = require("../helpers");
const PROPERTIES_POSITION = 2;
const PRIVATE_SUBNETS = [
    'aws_cdk_lib.aws_ec2.SubnetType.PRIVATE_ISOLATED',
    'aws_cdk_lib.aws_ec2.SubnetType.PRIVATE_WITH_EGRESS',
    'aws_cdk_lib.aws_ec2.SubnetType.PRIVATE_WITH_NAT',
];
const PUBLIC_SUBNET = 'aws_cdk_lib.aws_ec2.SubnetType.PUBLIC';
exports.rule = (0, cdk_1.AwsCdkTemplate)({
    'aws-cdk-lib.aws-ec2.Instance': (0, cdk_1.AwsCdkCheckArguments)('publicNetwork', false, ['vpcSubnets', 'subnetType'], { fqns: { invalid: [PUBLIC_SUBNET] } }),
    'aws-cdk-lib.aws-ec2.CfnInstance': checkCfnInstance,
    'aws-cdk-lib.aws_rds.DatabaseInstance': checkDatabaseInstance,
    'aws-cdk-lib.aws_rds.CfnDBInstance': (0, cdk_1.AwsCdkCheckArguments)('publicNetwork', false, 'publiclyAccessible', { primitives: { invalid: [true] } }),
    'aws-cdk-lib.aws_dms.CfnReplicationInstance': (0, cdk_1.AwsCdkCheckArguments)('publicNetwork', true, 'publiclyAccessible', { primitives: { invalid: [true] } }),
}, {
    meta: {
        messages: {
            publicNetwork: 'Make sure allowing public network access is safe here.',
        },
    },
});
function checkCfnInstance(expr, ctx) {
    const properties = (0, result_1.getResultOfExpression)(ctx, expr).getArgument(PROPERTIES_POSITION);
    const networkInterfaces = properties.getProperty('networkInterfaces');
    const sensitiveNetworkInterface = networkInterfaces.findInArray(result => getSensitiveNetworkInterface(result, ctx));
    if (sensitiveNetworkInterface.isFound) {
        ctx.report({
            messageId: 'publicNetwork',
            node: sensitiveNetworkInterface.node,
        });
    }
}
function getSensitiveNetworkInterface(networkInterface, ctx) {
    const associatePublicIpAddress = networkInterface.getProperty('associatePublicIpAddress');
    if (associatePublicIpAddress.isTrue && !isFoundPrivateSubnet(networkInterface, ctx)) {
        return associatePublicIpAddress;
    }
    else {
        return null;
    }
}
function isFoundPrivateSubnet(networkInterface, ctx) {
    const subnetId = networkInterface.getProperty('subnetId');
    const selectSubnetsCall = getSelectSubnetsCall(subnetId);
    const argument = selectSubnetsCall.getArgument(0);
    const subnetType = argument.getProperty('subnetType');
    return subnetType.isFound && isPrivateSubnet(subnetType.node, ctx);
}
function getSelectSubnetsCall(subnetId) {
    let current = subnetId;
    while (current.ofType('MemberExpression')) {
        current = current.getMemberObject();
    }
    return current.filter(n => n.type === 'CallExpression' && (0, helpers_1.isCallingMethod)(n, 1, 'selectSubnets'));
}
function checkDatabaseInstance(expr, ctx) {
    const properties = (0, result_1.getResultOfExpression)(ctx, expr).getArgument(PROPERTIES_POSITION);
    const vpcSubnets = properties.getProperty('vpcSubnets');
    const subnetType = vpcSubnets.getProperty('subnetType');
    const publiclyAccessible = properties.getProperty('publiclyAccessible');
    if (subnetType.isFound && isPrivateSubnet(subnetType.node, ctx)) {
        return;
    }
    if (publiclyAccessible.isTrue && subnetType.isFound && isPublicSubnet(subnetType.node, ctx)) {
        ctx.report({
            messageId: 'publicNetwork',
            node: publiclyAccessible.node,
        });
    }
    else if (!publiclyAccessible.isFound &&
        subnetType.isFound &&
        isPublicSubnet(subnetType.node, ctx)) {
        ctx.report({
            messageId: 'publicNetwork',
            node: subnetType.node,
        });
    }
}
function isPrivateSubnet(node, ctx) {
    return PRIVATE_SUBNETS.some(net => net === (0, helpers_1.getFullyQualifiedName)(ctx, node)?.replace(/-/g, '_'));
}
function isPublicSubnet(node, ctx) {
    return PUBLIC_SUBNET === (0, helpers_1.getFullyQualifiedName)(ctx, node)?.replace(/-/g, '_');
}
//# sourceMappingURL=rule.js.map