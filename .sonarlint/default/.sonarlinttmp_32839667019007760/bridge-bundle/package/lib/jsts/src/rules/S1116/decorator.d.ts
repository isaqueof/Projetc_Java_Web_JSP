import { Rule } from 'eslint';
import * as estree from 'estree';
export declare function decorate(rule: Rule.RuleModule): Rule.RuleModule;
export declare function isProtectionSemicolon(context: Rule.RuleContext, node: estree.Node): boolean;
