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
// https://sonarsource.github.io/rspec/#/rspec/S6303/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const cdk_1 = require("../helpers/aws/cdk");
const CfnDBCluster = 'CfnDBCluster';
const CfnDBInstance = 'CfnDBInstance';
const DatabaseCluster = 'DatabaseCluster';
const DatabaseClusterFromSnapshot = 'DatabaseClusterFromSnapshot';
const DatabaseInstance = 'DatabaseInstance';
const DatabaseInstanceReadReplica = 'DatabaseInstanceReadReplica';
exports.rule = (0, cdk_1.AwsCdkTemplate)({
    'aws-cdk-lib.aws_rds.CfnDBCluster': checkStorage(CfnDBCluster),
    'aws-cdk-lib.aws_rds.CfnDBInstance': checkStorage(CfnDBInstance),
    'aws-cdk-lib.aws_rds.DatabaseCluster': checkStorage(DatabaseCluster),
    'aws-cdk-lib.aws_rds.DatabaseClusterFromSnapshot': checkStorage(DatabaseClusterFromSnapshot),
    'aws-cdk-lib.aws_rds.DatabaseInstance': checkStorage(DatabaseInstance),
    'aws-cdk-lib.aws_rds.DatabaseInstanceReadReplica': checkStorage(DatabaseInstanceReadReplica),
}, {
    meta: {
        messages: {
            unsafe: 'Make sure that using unencrypted storage is safe here.',
            omitted: 'Omitting storageEncrypted disables RDS encryption. Make sure it is safe here.',
        },
    },
});
const PROPS_ARGUMENT_POSITION = 2;
function checkStorage(storage) {
    return (expr, ctx) => {
        const argument = expr.arguments[PROPS_ARGUMENT_POSITION];
        const props = (0, helpers_1.getValueOfExpression)(ctx, argument, 'ObjectExpression');
        if (isUnresolved(argument, props)) {
            return;
        }
        if (props === undefined) {
            report(expr.callee, 'omitted');
            return;
        }
        if (isException(storage, props)) {
            return;
        }
        const propertyKey = (0, helpers_1.getProperty)(props, 'storageEncrypted', ctx);
        if (propertyKey === null) {
            report(props, 'omitted');
        }
        if (!propertyKey) {
            return;
        }
        const propertyValue = (0, helpers_1.getUniqueWriteUsageOrNode)(ctx, propertyKey.value);
        if ((0, helpers_1.isFalseLiteral)(propertyValue)) {
            report(propertyKey.value, 'unsafe');
            return;
        }
        function isUnresolved(node, value) {
            return node?.type === 'Identifier' && !(0, helpers_1.isUndefined)(node) && value === undefined;
        }
        function isException(storage, props) {
            if (![
                DatabaseCluster,
                DatabaseClusterFromSnapshot,
                DatabaseInstance,
                DatabaseInstanceReadReplica,
            ].includes(storage)) {
                return false;
            }
            const exceptionKey = (0, helpers_1.getProperty)(props, 'storageEncryptionKey', ctx);
            if (exceptionKey == null) {
                return false;
            }
            const exceptionValue = (0, helpers_1.getUniqueWriteUsageOrNode)(ctx, exceptionKey.value);
            if (exceptionValue.type !== 'NewExpression') {
                return false;
            }
            const fqn = (0, cdk_1.normalizeFQN)((0, helpers_1.getFullyQualifiedName)(ctx, exceptionValue.callee));
            return fqn === 'aws_cdk_lib.aws_kms.Key' || fqn === 'aws_cdk_lib.aws_kms.Alias';
        }
        function report(node, messageId) {
            ctx.report({
                messageId,
                node,
            });
        }
    };
}
//# sourceMappingURL=rule.js.map