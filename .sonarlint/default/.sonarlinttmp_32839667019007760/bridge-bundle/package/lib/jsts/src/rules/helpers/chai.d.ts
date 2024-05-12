import { Rule } from 'eslint';
import * as estree from 'estree';
export declare namespace Chai {
    function isImported(context: Rule.RuleContext): boolean;
    function isAssertion(context: Rule.RuleContext, node: estree.Node): boolean;
}
