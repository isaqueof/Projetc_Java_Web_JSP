"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptReportForReact = exports.interceptReport = void 0;
const NUM_ARGS_NODE_MESSAGE = 2;
/**
 * Modifies the behavior of `context.report(descriptor)` for a given rule.
 *
 * Useful for performing additional checks before reporting an issue.
 *
 * @param rule the original rule
 * @param onReport replacement for `context.report(descr)`
 *                 invocations used inside of the rule
 * @param contextOverrider optional function to change the default context overridding mechanism
 */
function interceptReport(rule, onReport, contextOverrider) {
    return {
        // meta should be defined only when it's defined on original rule, otherwise RuleTester will fail
        ...(!!rule.meta && { meta: rule.meta }),
        create(originalContext) {
            let interceptingContext;
            if (contextOverrider == null) {
                interceptingContext = {
                    id: originalContext.id,
                    options: originalContext.options,
                    settings: originalContext.settings,
                    parserPath: originalContext.parserPath,
                    parserOptions: originalContext.parserOptions,
                    parserServices: originalContext.parserServices,
                    sourceCode: originalContext.sourceCode,
                    cwd: originalContext.cwd,
                    filename: originalContext.filename,
                    physicalFilename: originalContext.physicalFilename,
                    getCwd() {
                        return originalContext.cwd;
                    },
                    getPhysicalFilename() {
                        return originalContext.physicalFilename;
                    },
                    getAncestors() {
                        return originalContext.getAncestors();
                    },
                    getDeclaredVariables(node) {
                        return originalContext.getDeclaredVariables(node);
                    },
                    getFilename() {
                        return originalContext.filename;
                    },
                    getScope() {
                        return originalContext.getScope();
                    },
                    getSourceCode() {
                        return originalContext.sourceCode;
                    },
                    markVariableAsUsed(name) {
                        return originalContext.markVariableAsUsed(name);
                    },
                    report(...args) {
                        let descr = undefined;
                        if (args.length === 1) {
                            descr = args[0];
                        }
                        else if (args.length === NUM_ARGS_NODE_MESSAGE && typeof args[1] === 'string') {
                            // not declared in the `.d.ts`, but used in practice by rules written in JS
                            descr = {
                                node: args[0],
                                message: args[1],
                            };
                        }
                        if (descr) {
                            onReport(originalContext, descr);
                        }
                    },
                };
            }
            else {
                interceptingContext = contextOverrider(originalContext, onReport);
            }
            return rule.create(interceptingContext);
        },
    };
}
exports.interceptReport = interceptReport;
// interceptReport() by default doesn't work with the React plugin
// as the rules fail to find the context getFirstTokens() function.
function interceptReportForReact(rule, onReport) {
    return interceptReport(rule, onReport, contextOverriderForReact);
}
exports.interceptReportForReact = interceptReportForReact;
function contextOverriderForReact(context, onReport) {
    const overriddenReportContext = {
        report(reportDescriptor) {
            onReport(context, reportDescriptor);
        },
    };
    Object.setPrototypeOf(overriddenReportContext, context);
    return overriddenReportContext;
}
//# sourceMappingURL=interceptor.js.map