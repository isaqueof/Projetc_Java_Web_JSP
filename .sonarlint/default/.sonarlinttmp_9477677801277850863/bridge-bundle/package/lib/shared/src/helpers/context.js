"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setContext = exports.getContext = void 0;
/**
 * The global context
 *
 * It is available anywhere within the bridge as well as in
 * external and custom rules provided their definition sets
 * the `sonar-context` internal parameter.
 */
let context;
/**
 * Returns the global context
 * @returns the global context
 */
function getContext() {
    return context;
}
exports.getContext = getContext;
/**
 * Sets the global context
 * @param ctx the new global context
 */
function setContext(ctx) {
    context = { ...ctx };
}
exports.setContext = setContext;
//# sourceMappingURL=context.js.map