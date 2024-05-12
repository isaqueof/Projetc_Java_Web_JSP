import { Node } from 'estree';
import { Rule } from 'eslint';
import { Result } from '../result';
import { StringLiteral } from '../ast';
export interface PolicyCheckerOptions {
    effect: {
        property: string;
        type: 'FullyQualifiedName' | 'string';
        allowValue: string;
    };
    actions: {
        property: string;
        anyValues?: string[];
    };
    resources: {
        property: string;
    };
    conditions: {
        property: string;
    };
    principals: {
        property: string;
        type: 'FullyQualifiedName' | 'json';
        anyValues?: string[];
    };
}
type StatementChecker = (expr: Node, ctx: Rule.RuleContext, options: PolicyCheckerOptions) => void;
export declare function AwsIamPolicyTemplate(statementChecker: StatementChecker): Rule.RuleModule;
export declare function getSensitiveEffect(properties: Result, ctx: Rule.RuleContext, options: PolicyCheckerOptions): Result;
export declare function isAnyLiteral(literal: StringLiteral): boolean;
export {};
