"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = exports.info = exports.error = exports.debug = void 0;
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
/**
 * Prints a message to `stdout` like `console.log` by prefixing it with `DEBUG`.
 *
 * The `DEBUG` prefix is recognized by the scanner, which
 * will show the logged message in the scanner debug logs.
 *
 * @param message the message to log
 */
function debug(message) {
    console.log(`DEBUG ${message}`);
}
exports.debug = debug;
function error(message) {
    console.error(message);
}
exports.error = error;
function info(message) {
    console.log(message);
}
exports.info = info;
function warn(message) {
    console.log(`WARN ${message}`);
}
exports.warn = warn;
//# sourceMappingURL=logging.js.map