import { Rule } from 'eslint';
import * as estree from 'estree';
export declare const rule: Rule.RuleModule;
export declare function getPropertyValue(ctx: Rule.RuleContext, node: estree.ObjectExpression, propertyName: string): estree.Literal | undefined;
