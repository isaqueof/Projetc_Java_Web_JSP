import { Rule } from 'eslint';
import * as estree from 'estree';
export declare function isInsideVueSetupScript(node: estree.Node, ctx: Rule.RuleContext): boolean;
