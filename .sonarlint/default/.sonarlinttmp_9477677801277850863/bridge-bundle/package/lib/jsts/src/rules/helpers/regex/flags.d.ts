import * as estree from 'estree';
import { Rule } from 'eslint';
export declare function getFlags(callExpr: estree.CallExpression, context?: Rule.RuleContext): string | null;
