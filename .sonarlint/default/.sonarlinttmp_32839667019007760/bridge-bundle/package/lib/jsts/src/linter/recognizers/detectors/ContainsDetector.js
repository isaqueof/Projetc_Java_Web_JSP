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
class ContainsDetector extends Detector_1.default {
    constructor(probability, ...strings) {
        super(probability);
        this.strings = strings;
    }
    scan(line) {
        const lineWithoutSpaces = line.replace(/\s+/, '');
        let matchers = 0;
        for (const str of this.strings) {
            let regex = str;
            if (typeof str === 'string') {
                regex = new RegExp(escapeRegex(str), 'g');
            }
            matchers += (lineWithoutSpaces.match(regex) ?? []).length;
        }
        return matchers;
    }
}
exports.default = ContainsDetector;
function escapeRegex(value) {
    return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
//# sourceMappingURL=ContainsDetector.js.map