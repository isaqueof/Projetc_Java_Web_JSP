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
exports.logHeapStatistics = exports.registerGarbageCollectionObserver = exports.logMemoryError = exports.logMemoryConfiguration = void 0;
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
const v8 = __importStar(require("v8"));
const os = __importStar(require("os"));
const fs_1 = __importDefault(require("fs"));
const perf_hooks_1 = require("perf_hooks");
const shared_1 = require("@sonar/shared");
const MB = 1024 * 1024;
function logMemoryConfiguration() {
    const osMem = Math.floor(os.totalmem() / MB);
    const heapSize = getHeapSize();
    const dockerMemLimit = readDockerMemoryLimit();
    const dockerMem = dockerMemLimit ? `, Docker (${dockerMemLimit} MB)` : ',';
    (0, shared_1.info)(`Memory configuration: OS (${osMem} MB)${dockerMem} Node.js (${heapSize} MB).`);
    if (heapSize > osMem) {
        (0, shared_1.warn)(`Node.js heap size limit ${heapSize} is higher than available memory ${osMem}. Check your configuration of sonar.javascript.node.maxspace`);
    }
}
exports.logMemoryConfiguration = logMemoryConfiguration;
function readDockerMemoryLimit() {
    return (readDockerMemoryLimitFrom('/sys/fs/cgroup/memory.max') ??
        readDockerMemoryLimitFrom('/sys/fs/cgroup/memory.limit_in_bytes'));
}
function readDockerMemoryLimitFrom(cgroupPath) {
    try {
        const mem = Number.parseInt(fs_1.default.readFileSync(cgroupPath, { encoding: 'utf8' }));
        if (Number.isInteger(mem)) {
            return mem / MB;
        }
    }
    catch (e) {
        // probably not a docker env
    }
    return undefined;
}
function getHeapSize() {
    return Math.floor(v8.getHeapStatistics().heap_size_limit / MB);
}
function logMemoryError(err) {
    switch (err?.code) {
        case 'ERR_WORKER_OUT_OF_MEMORY':
            (0, shared_1.error)(`The analysis will stop due to the Node.js process running out of memory (heap size limit ${getHeapSize()} MB)`);
            (0, shared_1.error)(`You can see how Node.js heap usage evolves during analysis with "sonar.javascript.node.debugMemory=true"`);
            (0, shared_1.error)('Try setting "sonar.javascript.node.maxspace" to a higher value to increase Node.js heap size limit');
            (0, shared_1.error)('If the problem persists, please report the issue at https://community.sonarsource.com');
            break;
        default:
            (0, shared_1.error)(`The analysis will stop due to an unexpected error: ${err}`);
            (0, shared_1.error)('Please report the issue at https://community.sonarsource.com');
            break;
    }
}
exports.logMemoryError = logMemoryError;
function registerGarbageCollectionObserver() {
    const obs = new perf_hooks_1.PerformanceObserver(items => {
        items
            .getEntries()
            .filter(item => item.detail?.kind === perf_hooks_1.constants.NODE_PERFORMANCE_GC_MAJOR)
            .forEach(item => {
            (0, shared_1.debug)(`Major GC event`);
            (0, shared_1.debug)(JSON.stringify(item));
            logHeapStatistics();
        });
    });
    obs.observe({ entryTypes: ['gc'] });
}
exports.registerGarbageCollectionObserver = registerGarbageCollectionObserver;
function logHeapStatistics() {
    if ((0, shared_1.getContext)().debugMemory) {
        (0, shared_1.debug)(JSON.stringify(v8.getHeapStatistics()));
    }
}
exports.logHeapStatistics = logHeapStatistics;
//# sourceMappingURL=memory.js.map