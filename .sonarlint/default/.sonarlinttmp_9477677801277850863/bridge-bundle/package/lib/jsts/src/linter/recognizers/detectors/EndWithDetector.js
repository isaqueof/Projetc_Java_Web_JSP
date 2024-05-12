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
class EndWithDetector extends Detector_1.default {
    constructor(probability, ...endOfLines) {
        super(probability);
        this.endOfLines = endOfLines;
    }
    scan(line) {
        for (let i = line.length - 1; i >= 0; i--) {
            const char = line.charAt(i);
            for (const endOfLine of this.endOfLines) {
                if (char === endOfLine) {
                    return 1;
                }
            }
            if (!isWhitespace(char) && char !== '*' && char !== '/') {
                return 0;
            }
        }
        return 0;
        function isWhitespace(char) {
            return /\s/.test(char);
        }
    }
}
exports.default = EndWithDetector;
//# sourceMappingURL=EndWithDetector.js.map