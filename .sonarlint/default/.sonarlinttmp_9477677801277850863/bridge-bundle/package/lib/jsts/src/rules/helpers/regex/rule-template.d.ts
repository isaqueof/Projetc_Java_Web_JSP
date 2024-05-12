import { Rule } from 'eslint';
import * as estree from 'estree';
import * as regexpp from '@eslint-community/regexpp';
import type { RegExpVisitor } from '@eslint-community/regexpp/visitor';
/**
 * Rule context for regex rules that also includes the original ESLint node
 * denoting the regular expression (string) literal.
 */
export type RegexRuleContext = Rule.RuleContext & {
    node: estree.Node;
    reportRegExpNode: (descriptor: RegexReportDescriptor) => void;
};
type RegexReportMessage = Rule.ReportDescriptorMessage;
type RegexReportData = {
    regexpNode: regexpp.AST.Node;
    node: estree.Node;
    offset?: [number, number];
};
type RegexReportOptions = Rule.ReportDescriptorOptions;
type RegexReportDescriptor = RegexReportData & RegexReportMessage & RegexReportOptions;
/**
 * Rule template to create regex rules.
 * @param handlers - the regexpp node handlers
 * @param meta - the (optional) rule metadata
 * @returns the resulting rule module
 */
export declare function createRegExpRule(handlers: (context: RegexRuleContext) => RegExpVisitor.Handlers, metadata?: {
    meta: Rule.RuleMetaData;
}): Rule.RuleModule;
export {};
