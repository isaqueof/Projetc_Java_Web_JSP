"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
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
 * `module-alias` must be imported first for module aliasing to work.
 */
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./router"));
const errors_1 = require("./errors");
const shared_1 = require("@sonar/shared");
const timeout_1 = require("./timeout");
const worker_threads_1 = require("worker_threads");
const memory_1 = require("./memory");
/**
 * The maximum request body size
 */
const MAX_REQUEST_SIZE = '50mb';
/**
 * The default timeout to shut down server if no request is received
 *
 * Normally, the Java plugin sends keepalive requests to the bridge
 * If the Java plugin crashes, this timeout will run out and shut down
 * the bridge to prevent it from becoming an orphan process.
 */
const SHUTDOWN_TIMEOUT = 15000;
/**
 * A pool of a single worker thread
 *
 * The main thread of the bridge delegates CPU-intensive operations to
 * a worker thread. These include all HTTP requests sent by the plugin
 * that require maintaining a state across requests, namely initialized
 * linters, created programs, and whatever information TypeScript ESLint
 * and TypeScript keep at runtime.
 */
let worker;
/**
 * Starts the bridge
 *
 * The bridge is an Express.js web server that exposes several services
 * through a REST API. Once started, the bridge first begins by loading
 * any provided rule bundles and then waits for incoming requests.
 *
 * Communication between two ends is entirely done with the JSON format.
 *
 * Although a web server, the bridge is not exposed to the outside world
 * but rather exclusively communicate either with the JavaScript plugin
 * which embeds it or directly with SonarLint.
 *
 * @param port the port to listen to
 * @param host only for usage from outside of Node.js - Java plugin, SonarLint, ...
 * @param timeout timeout in ms to shut down the server if unresponsive
 * @returns an http server
 */
function start(port = 0, host = '127.0.0.1', timeout = SHUTDOWN_TIMEOUT) {
    (0, memory_1.logMemoryConfiguration)();
    if ((0, shared_1.getContext)().debugMemory) {
        (0, memory_1.registerGarbageCollectionObserver)();
    }
    return new Promise(resolve => {
        (0, shared_1.debug)('Starting the bridge server');
        worker = new worker_threads_1.Worker(path_1.default.resolve(__dirname, 'worker.js'), {
            workerData: { context: (0, shared_1.getContext)() },
            env: worker_threads_1.SHARE_ENV,
        });
        worker.on('online', () => {
            (0, shared_1.debug)('The worker thread is running');
        });
        worker.on('exit', code => {
            (0, shared_1.debug)(`The worker thread exited with code ${code}`);
        });
        worker.on('error', err => {
            (0, shared_1.debug)(`The worker thread failed: ${err}`);
            (0, memory_1.logMemoryError)(err);
            /**
             * At this point, the worker thread can no longer respond to any request from the plugin.
             * However, existing requests are stalled until they time out. Since the bridge server is
             * about to be shut down in an unexpected manner anyway, we can close all connections and
             * avoid waiting unnecessarily for them to eventually close.
             */
            server.closeAllConnections();
            (0, shared_1.debug)('Shutting down the bridge server due to failure');
            shutdown();
        });
        const app = (0, express_1.default)();
        const server = http_1.default.createServer(app);
        /**
         * Builds a timeout middleware to shut down the server
         * in case the process becomes orphan.
         */
        const orphanTimeout = (0, timeout_1.timeoutMiddleware)(() => {
            if (server.listening) {
                shutdown();
            }
        }, timeout);
        /**
         * The order of the middlewares registration is important, as the
         * error handling one should be last.
         */
        app.use(express_1.default.json({ limit: MAX_REQUEST_SIZE }));
        app.use(orphanTimeout.middleware);
        app.use((0, router_1.default)(worker));
        app.use(errors_1.errorMiddleware);
        app.post('/close', (_, response) => {
            (0, shared_1.debug)('Shutting down the bridge server');
            response.end(() => {
                shutdown();
            });
        });
        server.on('close', () => {
            (0, shared_1.debug)('The bridge server shut down');
            orphanTimeout.stop();
        });
        server.on('error', err => {
            (0, shared_1.debug)(`The bridge server failed: ${err}`);
        });
        server.on('listening', () => {
            /**
             * Since we use 0 as the default port, Node.js assigns a random port to the server,
             * which we get using server.address().
             */
            (0, shared_1.debug)(`The bridge server is listening on port ${server.address()?.port}`);
            resolve(server);
        });
        server.listen(port, host);
        /**
         * Shutdown the server and the worker thread
         */
        function shutdown() {
            worker.terminate().catch(reason => (0, shared_1.debug)(`Failed to terminate the worker thread: ${reason}`));
            server.close();
        }
    });
}
exports.start = start;
//# sourceMappingURL=server.js.map