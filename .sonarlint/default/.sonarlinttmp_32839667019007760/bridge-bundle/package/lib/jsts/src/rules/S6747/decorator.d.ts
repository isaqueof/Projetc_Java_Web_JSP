import { Rule } from 'eslint';
/**
 * The core implementation of the rule includes a fix without a message.
 * That fix suggests using a standard property name that is available in
 * the report data. This decorator turns the reported fix into a suggestion
 * and adds to it a dynamic description rather than a fixed one.
 */
export declare function decorate(rule: Rule.RuleModule): Rule.RuleModule;
