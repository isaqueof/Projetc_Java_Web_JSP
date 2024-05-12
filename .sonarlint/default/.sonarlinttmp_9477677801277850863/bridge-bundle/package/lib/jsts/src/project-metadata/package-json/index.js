"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearestPackageJsons = exports.getDependencies = exports.setPackageJsons = exports.clearPackageJsons = exports.getPackageJsonsCount = exports.getAllPackageJsons = exports.loadPackageJsons = exports.parsePackageJson = exports.PACKAGE_JSON = void 0;
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
const path_1 = __importDefault(require("path"));
const shared_1 = require("@sonar/shared");
exports.PACKAGE_JSON = 'package.json';
const parsePackageJson = (_filename, contents) => contents ? JSON.parse(contents) : {};
exports.parsePackageJson = parsePackageJson;
const DefinitelyTyped = '@types/';
/**
 * Cache for each dirname the dependencies of the package.json in this directory, empty set when no package.json.
 */
const dirCache = new Map();
/**
 * Cache for the available dependencies by dirname.
 */
const cache = new Map();
let PackageJsonsByBaseDir;
function loadPackageJsons(baseDir, exclusions) {
    const { packageJsons } = (0, shared_1.searchFiles)(baseDir, {
        packageJsons: {
            pattern: exports.PACKAGE_JSON,
            parser: exports.parsePackageJson,
        },
    }, exclusions);
    PackageJsonsByBaseDir = packageJsons;
}
exports.loadPackageJsons = loadPackageJsons;
function getAllPackageJsons() {
    return PackageJsonsByBaseDir;
}
exports.getAllPackageJsons = getAllPackageJsons;
function getPackageJsonsCount() {
    return Object.keys(PackageJsonsByBaseDir).length;
}
exports.getPackageJsonsCount = getPackageJsonsCount;
function clearPackageJsons() {
    PackageJsonsByBaseDir = {};
}
exports.clearPackageJsons = clearPackageJsons;
function setPackageJsons(db) {
    PackageJsonsByBaseDir = db;
}
exports.setPackageJsons = setPackageJsons;
/**
 * Retrieve the dependencies of all the package.json files available for the given file.
 *
 * @param fileName context.filename
 * @returns
 */
function getDependencies(fileName) {
    let dirname = path_1.default.posix.dirname((0, shared_1.toUnixPath)(fileName));
    const cached = cache.get(dirname);
    if (cached) {
        return cached;
    }
    const result = new Set();
    cache.set(dirname, result);
    for (const packageJson of getNearestPackageJsons(fileName)) {
        dirname = path_1.default.posix.dirname(packageJson.filename);
        const dirCached = dirCache.get(dirname);
        if (dirCached) {
            dirCached.forEach(d => result.add(d));
        }
        else {
            const dep = getDependenciesFromPackageJson(packageJson.contents);
            dep.forEach(d => result.add(d));
            dirCache.set(dirname, dep);
        }
    }
    return result;
}
exports.getDependencies = getDependencies;
/**
 * Given a filename, return all package.json files in the ancestor paths
 * ordered from nearest to furthest
 *
 * @param file source file for which we need a package.json
 */
function getNearestPackageJsons(file) {
    if (!getAllPackageJsons()) {
        return [];
    }
    const results = [];
    if (getPackageJsonsCount() === 0) {
        return results;
    }
    let currentDir = path_1.default.posix.dirname(path_1.default.posix.normalize((0, shared_1.toUnixPath)(file)));
    do {
        const packageJson = PackageJsonsByBaseDir[currentDir];
        if (packageJson?.length) {
            results.push(...packageJson);
        }
        currentDir = path_1.default.posix.dirname(currentDir);
    } while (currentDir !== path_1.default.posix.dirname(currentDir));
    return results;
}
exports.getNearestPackageJsons = getNearestPackageJsons;
function getDependenciesFromPackageJson(content) {
    const result = new Set();
    if (content.name) {
        addDependencies(result, { [content.name]: '*' });
    }
    if (content.dependencies !== undefined) {
        addDependencies(result, content.dependencies);
    }
    if (content.devDependencies !== undefined) {
        addDependencies(result, content.devDependencies);
    }
    if (content.peerDependencies !== undefined) {
        addDependencies(result, content.peerDependencies);
    }
    return result;
}
function addDependencies(result, dependencies) {
    Object.keys(dependencies).forEach(name => result.add(name.startsWith(DefinitelyTyped) ? name.substring(DefinitelyTyped.length) : name));
}
//# sourceMappingURL=index.js.map