import { JsTsLanguage } from '@sonar/shared';
import { JsTsAnalysisInput } from '../analysis';
/**
 * Builds an ESLint SourceCode for JavaScript / TypeScript
 *
 * This functions routes the parsing of the input based on the input language,
 * the file extension, and some contextual information.
 *
 * @param input the JavaScript / TypeScript analysis input
 * @param language the language of the input
 * @returns the parsed source code
 */
export declare function buildSourceCode(input: JsTsAnalysisInput, language: JsTsLanguage): import("eslint").SourceCode;
