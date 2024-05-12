import { SourceCode } from 'eslint';
import { EmbeddedJS, EmbeddedAnalysisInput } from '../analysis';
export type ExtendedSourceCode = SourceCode & {
    syntheticFilePath: string;
};
export type LanguageParser = (text: string) => EmbeddedJS[];
/**
 * Builds ESLint SourceCode instances for every embedded JavaScript.
 *
 * In the case of AWS functions in YAML,
 * the filepath is augmented with the AWS function name, returned as the syntheticFilePath property
 *
 * If there is at least one parsing error in any snippet, we return only the first error and
 * we don't even consider any parsing errors in the remaining snippets for simplicity.
 */
export declare function buildSourceCodes(input: EmbeddedAnalysisInput, languageParser: LanguageParser): ExtendedSourceCode[];
/**
 * Returns the filename composed as following:
 *
 * {filepath-without-extention}-{resourceName}{filepath-extension}
 */
export declare function composeSyntheticFilePath(filePath: string, resourceName: string): string;
