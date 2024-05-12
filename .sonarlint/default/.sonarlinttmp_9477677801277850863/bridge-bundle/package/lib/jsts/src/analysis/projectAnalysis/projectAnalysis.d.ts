import { FileType, JsTsLanguage } from '@sonar/shared';
import { JsTsAnalysisOutput, RuleConfig } from '../../';
export type ProjectAnalysisOutput = {
    files: {
        [key: string]: JsTsAnalysisOutput;
    };
    meta?: {
        withProgram: boolean;
        withWatchProgram: boolean;
        filesWithoutTypeChecking: string[];
        programsCreated: string[];
    };
};
export type JsTsFile = {
    fileContent?: string;
    ignoreHeaderComments?: boolean;
    fileType: FileType;
    language?: JsTsLanguage;
};
export type JsTsFiles = {
    [key: string]: JsTsFile;
};
export type ProjectAnalysisInput = {
    files: JsTsFiles;
    rules: RuleConfig[];
    environments?: string[];
    globals?: string[];
    baseDir: string;
    exclusions?: string[];
    isSonarlint?: boolean;
    maxFilesForTypeChecking?: number;
};
export declare const DEFAULT_LANGUAGE: JsTsLanguage;
export declare const DEFAULT_MAX_FILES_FOR_TYPE_CHECKING = 20000;
export declare const DEFAULT_ENVIRONMENTS: string[];
export declare const DEFAULT_GLOBALS: string[];
