import { Linter } from 'eslint';
import { CustomRule } from './custom-rules';
export declare function loadCustomRules(linter: Linter, rules?: CustomRule[]): void;
export declare function loadBundles(linter: Linter, rulesBundles: (keyof typeof loaders)[]): void;
/**
 * Loaders for each of the predefined rules bundles. Each bundle comes with a
 * different data structure (array/record/object).
 */
declare const loaders: {
    [key: string]: Function;
};
export {};
