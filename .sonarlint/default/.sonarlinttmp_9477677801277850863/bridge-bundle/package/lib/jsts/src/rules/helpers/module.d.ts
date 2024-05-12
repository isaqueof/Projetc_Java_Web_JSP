import { Rule, Scope } from 'eslint';
import * as estree from 'estree';
import Variable = Scope.Variable;
export declare function getImportDeclarations(context: Rule.RuleContext): estree.ImportDeclaration[];
export declare function getRequireCalls(context: Rule.RuleContext): estree.CallExpression[];
/**
 * Returns the fully qualified name of ESLint node
 *
 * This function filters out the `node:` prefix
 *
 * A fully qualified name here denotes a value that is accessed through an imported
 * symbol, e.g., `foo.bar.baz` where `foo` was imported either from a require call
 * or an import statement:
 *
 * ```
 * const foo = require('lib');
 * foo.bar.baz.qux; // matches the fully qualified name 'lib.bar.baz.qux' (not 'foo.bar.baz.qux')
 * const foo2 = require('lib').bar;
 * foo2.baz.qux; // matches the fully qualified name 'lib.bar.baz.qux'
 * ```
 *
 * Returns null when an FQN could not be found.
 *
 * @param context the rule context
 * @param node the node
 * @param fqn the already traversed FQN (for recursive calls)
 * @param scope scope to look for the variable definition, used in recursion not to
 *              loop over same variable always in the lower scope
 */
export declare function getFullyQualifiedName(context: Rule.RuleContext, node: estree.Node, fqn?: string[], scope?: Scope.Scope): string | null;
/**
 * Just like getFullyQualifiedName(), but does not filter out the `node:` prefix.
 *
 * To be used for rules that need to work with the `node:` prefix.
 */
export declare function getFullyQualifiedNameRaw(context: Rule.RuleContext, node: estree.Node, fqn: string[], scope?: Scope.Scope, visitedVars?: Variable[]): string | null;
/**
 * Helper function for getFullyQualifiedName to handle Member expressions
 * filling in the FQN array with the accessed properties.
 * @param node the Node to traverse
 * @param fqn the array with the qualifiers
 */
export declare function reduceToIdentifier(node: estree.Node, fqn?: string[]): estree.Node;
/**
 * Reduce a given node through its ancestors until a given node type is found
 * filling in the FQN array with the accessed properties.
 * @param type the type of node you are looking for to be returned. Returned node still needs to be
 *             checked as its type it's not guaranteed to match the passed type.
 * @param node the Node to traverse
 * @param fqn the array with the qualifiers
 */
export declare function reduceTo<T extends estree.Node['type']>(type: T, node: estree.Node, fqn?: string[]): estree.Node;
