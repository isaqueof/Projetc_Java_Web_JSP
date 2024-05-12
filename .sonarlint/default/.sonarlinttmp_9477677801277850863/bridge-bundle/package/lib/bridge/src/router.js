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
const express_1 = __importDefault(require("express"));
const worker_1 = require("./worker");
function default_1(worker) {
    const router = express_1.default.Router();
    /** Endpoints running on the worker thread */
    router.post('/analyze-project', (0, worker_1.delegate)(worker, 'on-analyze-project'));
    router.post('/analyze-css', (0, worker_1.delegate)(worker, 'on-analyze-css'));
    router.post('/analyze-js', (0, worker_1.delegate)(worker, 'on-analyze-js'));
    router.post('/analyze-html', (0, worker_1.delegate)(worker, 'on-analyze-html'));
    router.post('/analyze-ts', (0, worker_1.delegate)(worker, 'on-analyze-ts'));
    router.post('/analyze-with-program', (0, worker_1.delegate)(worker, 'on-analyze-with-program'));
    router.post('/analyze-yaml', (0, worker_1.delegate)(worker, 'on-analyze-yaml'));
    router.post('/create-program', (0, worker_1.delegate)(worker, 'on-create-program'));
    router.post('/create-tsconfig-file', (0, worker_1.delegate)(worker, 'on-create-tsconfig-file'));
    router.post('/delete-program', (0, worker_1.delegate)(worker, 'on-delete-program'));
    router.post('/init-linter', (0, worker_1.delegate)(worker, 'on-init-linter'));
    router.post('/new-tsconfig', (0, worker_1.delegate)(worker, 'on-new-tsconfig'));
    router.post('/tsconfig-files', (0, worker_1.delegate)(worker, 'on-tsconfig-files'));
    /** Endpoints running on the main thread */
    router.get('/status', (_, response) => response.send('OK!'));
    return router;
}
exports.default = default_1;
//# sourceMappingURL=router.js.map