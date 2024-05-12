"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const Detector_1 = __importDefault(require("../Detector"));
class CamelCaseDetector extends Detector_1.default {
    scan(line) {
        let previousChar = ' ';
        let currentChar;
        for (let i = 0; i < line.length; i++) {
            currentChar = line.charAt(i);
            if (isLowerCaseThenUpperCase(previousChar, currentChar)) {
                return 1;
            }
            previousChar = currentChar;
        }
        return 0;
    }
}
exports.default = CamelCaseDetector;
function isLowerCaseThenUpperCase(previousChar, char) {
    return isLowercase(previousChar) && isUpprcase(char);
    function isLowercase(char) {
        return char.toLowerCase() === char;
    }
    function isUpprcase(char) {
        return char.toUpperCase() === char;
    }
}
//# sourceMappingURL=CamelCaseDetector.js.map