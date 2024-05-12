"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_JSTS_ANALYSIS_OUTPUT = exports.parseParsingError = exports.errorMiddleware = void 0;
const shared_1 = require("@sonar/shared");
/**
 * Express.js middleware for handling error while serving requests.
 *
 * The purpose of this middleware is to catch any error occuring within
 * the different layers of the bridge to centralize and customize error
 * information that is sent back.
 *
 * The fourth parameter is necessary to identify this as an error middleware.
 * @see https://expressjs.com/en/guide/error-handling.html
 */
function errorMiddleware(err, _request, response, _next) {
    const { code, message, stack } = err;
    switch (code) {
        case shared_1.ErrorCode.Parsing:
            response.json(parseParsingError(err));
            break;
        case shared_1.ErrorCode.FailingTypeScript:
        case shared_1.ErrorCode.LinterInitialization:
            response.json({
                parsingError: {
                    message,
                    code,
                },
            });
            break;
        default:
            (0, shared_1.error)(stack);
            response.json({ error: message });
            break;
    }
}
exports.errorMiddleware = errorMiddleware;
function parseParsingError(error) {
    return {
        parsingError: {
            message: error.message,
            code: error.code,
            line: error.data?.line,
        },
        ...exports.EMPTY_JSTS_ANALYSIS_OUTPUT,
    };
}
exports.parseParsingError = parseParsingError;
/**
 * An empty JavaScript / TypeScript analysis output sent back on paring errors.
 */
exports.EMPTY_JSTS_ANALYSIS_OUTPUT = {
    issues: [],
    highlights: [],
    highlightedSymbols: [],
    metrics: {
        ncloc: [],
        commentLines: [],
        nosonarLines: [],
        executableLines: [],
        functions: 0,
        statements: 0,
        classes: 0,
        complexity: 0,
        cognitiveComplexity: 0,
    },
    cpdTokens: [],
    perf: {
        parseTime: 0,
        analysisTime: 0,
    },
};
//# sourceMappingURL=middleware.js.map