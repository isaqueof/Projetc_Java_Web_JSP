import { SourceCode } from 'eslint';
import { ParseFunction } from './eslint';
/**
 * Parses a JavaScript / TypeScript analysis input with an ESLint-based parser
 * @param code the JavaScript / TypeScript code to parse
 * @param parse the ESLint parsing function to use for parsing
 * @param options the ESLint parser options
 * @returns the parsed source code
 */
export declare function parseForESLint(code: string, parse: ParseFunction, options: {}): SourceCode;
