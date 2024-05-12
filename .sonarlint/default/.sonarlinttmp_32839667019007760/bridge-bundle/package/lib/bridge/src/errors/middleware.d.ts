import express from 'express';
import { ErrorCode } from '@sonar/shared';
import { JsTsAnalysisOutput } from '@sonar/jsts';
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
export declare function errorMiddleware(err: any, _request: express.Request, response: express.Response, _next: express.NextFunction): void;
export declare function parseParsingError(error: {
    message: string;
    code: ErrorCode;
    data?: {
        line: number;
    };
}): {
    parsingError: import("@sonar/jsts").ParsingError;
    issues: import("@sonar/jsts").Issue[];
    highlights?: import("@sonar/jsts").SyntaxHighlight[] | undefined;
    highlightedSymbols?: import("@sonar/jsts").SymbolHighlight[] | undefined;
    metrics?: import("@sonar/jsts").Metrics | undefined;
    cpdTokens?: import("@sonar/jsts").CpdToken[] | undefined;
    perf?: import("../../../jsts/src/monitoring").Perf | undefined;
    ucfgPaths?: string[] | undefined;
};
/**
 * An empty JavaScript / TypeScript analysis output sent back on paring errors.
 */
export declare const EMPTY_JSTS_ANALYSIS_OUTPUT: JsTsAnalysisOutput;
