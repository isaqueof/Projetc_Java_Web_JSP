import { Rule, AST } from 'eslint';
export declare function decorate(rule: Rule.RuleModule): Rule.RuleModule;
export declare function suggestEmptyBlockQuickFix(context: Rule.RuleContext, descriptor: Rule.ReportDescriptor, blockType: string, openingBrace: AST.Token, closingBrace: AST.Token): void;
