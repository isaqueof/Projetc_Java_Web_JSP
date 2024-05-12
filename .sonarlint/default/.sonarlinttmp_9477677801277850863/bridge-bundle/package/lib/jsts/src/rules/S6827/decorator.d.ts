import { Rule } from 'eslint';
/**
 * This fix was introduced in eslint-plugin-jsx-a11y e6bfd5cb7c,
 * but the last release is almost a year old, so it doesn't include this.
 * When we update the dependency, we can remove this decorator.
 *
 * This will include the removal of:
 * - the `jsx-ast-utils` dependency
 * - its type definition `typings/jsx-ast-utils/index.d.ts`
 * - all files in the `rules/S6827/` directory
 */
export declare function decorate(rule: Rule.RuleModule): Rule.RuleModule;
