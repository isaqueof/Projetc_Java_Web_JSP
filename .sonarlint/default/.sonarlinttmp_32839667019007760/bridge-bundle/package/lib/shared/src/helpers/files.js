"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileReadable = exports.addTsConfigIfDirectory = exports.toUnixPath = exports.stripBOM = exports.readFileSync = exports.readFile = void 0;
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
const fs_1 = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Byte Order Marker
 */
const BOM_BYTE = 0xfeff;
/**
 * Asynchronous read of file contents from a file path
 *
 * The function gets rid of any Byte Order Marker (BOM)
 * present in the file's header.
 *
 * @param filePath the path of a file
 * @returns Promise which resolves with the content of the file
 */
async function readFile(filePath) {
    const fileContent = await fs_1.default.promises.readFile(filePath, { encoding: 'utf8' });
    return stripBOM(fileContent);
}
exports.readFile = readFile;
/**
 * Synchronous read of file contents from a file path
 *
 * The function gets rid of any Byte Order Marker (BOM)
 * present in the file's header.
 *
 * @param filePath the path of a file
 * @returns Promise which resolves with the content of the file
 */
function readFileSync(filePath) {
    const fileContent = fs_1.default.readFileSync(filePath, { encoding: 'utf8' });
    return stripBOM(fileContent);
}
exports.readFileSync = readFileSync;
/**
 * Removes any Byte Order Marker (BOM) from a string's head
 *
 * A string's head is nothing else but its first character.
 *
 * @param str the input string
 * @returns the stripped string
 */
function stripBOM(str) {
    if (str.charCodeAt(0) === BOM_BYTE) {
        return str.slice(1);
    }
    return str;
}
exports.stripBOM = stripBOM;
/**
 * Converts a path to Unix format
 * @param path the path to convert
 * @returns the converted path
 */
function toUnixPath(path) {
    return path.replace(/[\\/]+/g, '/');
}
exports.toUnixPath = toUnixPath;
/**
 * Adds tsconfig.json to a path if it does not exist
 *
 * @param tsConfig
 */
function addTsConfigIfDirectory(tsConfig) {
    try {
        if (fs_1.default.lstatSync(tsConfig).isDirectory()) {
            return path_1.default.join(tsConfig, 'tsconfig.json');
        }
        return tsConfig;
    }
    catch {
        return null;
    }
}
exports.addTsConfigIfDirectory = addTsConfigIfDirectory;
/**
 * Asynchronous check if file is readable.
 *
 * @param path the file path
 * @returns true if file is readable. false otherwise
 */
async function fileReadable(path) {
    try {
        await fs_1.default.promises.access(path, fs_1.constants.R_OK);
        return true;
    }
    catch {
        return false;
    }
}
exports.fileReadable = fileReadable;
//# sourceMappingURL=files.js.map