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
// https://sonarsource.github.io/rspec/#/rspec/S6275/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const cdk_1 = require("../helpers/aws/cdk");
exports.rule = (0, cdk_1.AwsCdkTemplate)({
    'aws-cdk-lib.aws-ec2.Volume': (0, cdk_1.AwsCdkCheckArguments)(['encryptionOmitted', 'encryptionDisabled'], true, 'encrypted', { primitives: { invalid: [false] } }),
}, {
    meta: {
        messages: {
            encryptionDisabled: 'Make sure that using unencrypted volumes is safe here.',
            encryptionOmitted: 'Omitting "encrypted" disables volumes encryption. Make sure it is safe here.',
        },
    },
});
//# sourceMappingURL=rule.js.map