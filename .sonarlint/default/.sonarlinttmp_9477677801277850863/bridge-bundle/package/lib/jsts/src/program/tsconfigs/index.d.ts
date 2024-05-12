import { File } from '@sonar/shared';
export declare const TSCONFIG_JSON = "tsconfig.json";
export declare function loadTSConfigs(baseDir: string, exclusions: string[]): void;
export declare function clearTSConfigs(): void;
export declare function getTSConfigsCount(): number;
export declare function setTSConfigs(db: Record<string, File<void>[]>): void;
export declare function getTSConfigsIterator(files: string[], baseDir: string, sonarLint: boolean, maxFilesForTypeChecking?: number): AsyncGenerator<string, void, unknown>;
