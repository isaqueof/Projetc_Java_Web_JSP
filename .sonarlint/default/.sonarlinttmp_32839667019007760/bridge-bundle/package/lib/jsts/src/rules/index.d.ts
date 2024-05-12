import { Rule } from 'eslint';
/**
 * Maps ESLint rule keys declared in the JavaScript checks to rule implementations
 */
declare const rules: {
    [key: string]: Rule.RuleModule;
};
export { rules };
