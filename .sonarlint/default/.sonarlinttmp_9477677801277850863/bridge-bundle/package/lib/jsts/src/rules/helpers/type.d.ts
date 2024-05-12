import * as estree from 'estree';
import ts from 'typescript';
import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { RequiredParserServices } from '../helpers';
import { Rule } from 'eslint';
export type RuleContext = TSESLint.RuleContext<string, string[]>;
export declare function isArray(node: estree.Node, services: RequiredParserServices): boolean;
/**
 * TypeScript provides a set of utility types to facilitate type transformations.
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html
 */
export declare const UTILITY_TYPES: Set<string>;
/**
 * JavaScript typed arrays
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
 */
export declare const TYPED_ARRAY_TYPES: string[];
/**
 * Checks if the provided node is a JS typed array like "BigInt64Array". See TYPED_ARRAY_TYPES
 *
 * @param node
 * @param services
 * @returns
 */
export declare function isTypedArray(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isString(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isNumber(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isBigIntType(type: ts.Type): boolean;
export declare function isNumberType(type: ts.Type): boolean;
export declare function isStringType(type: ts.Type): boolean;
export declare function isFunction(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isUnion(node: estree.Node, services: RequiredParserServices): boolean;
/**
 * Returns an array of the union types if the provided type is a union.
 * Otherwise, returns an array containing the provided type as its unique element.
 * @param type A TypeScript type.
 * @return An array of types. It's never empty.
 */
export declare function getUnionTypes(type: ts.Type): ts.Type[];
export declare function isUndefinedOrNull(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isThenable(node: estree.Node, services: RequiredParserServices): boolean;
export declare function isAny(type: ts.Type): boolean;
/**
 * Checks if a node has a generic type like:
 *
 * function foo<T> (bar: T) {
 *    bar // is generic
 * }
 *
 * @param node TSESTree.Node
 * @param services RuleContext.parserServices
 * @returns
 */
export declare function isGenericType(node: TSESTree.Node, services: RequiredParserServices): boolean;
export declare function getTypeFromTreeNode(node: estree.Node, services: RequiredParserServices): ts.Type;
export declare function getTypeAsString(node: estree.Node, services: RequiredParserServices): string;
export declare function getSymbolAtLocation(node: estree.Node, services: RequiredParserServices): ts.Symbol | undefined;
export declare function getSignatureFromCallee(node: estree.Node, services: RequiredParserServices): ts.Signature | undefined;
/**
 * This function checks if a type may correspond to an array type. Beyond simple array types, it will also
 * consider the union of array types and generic types extending an array type.
 * @param type A type to check
 * @param services The services used to get access to the TypeScript type checker
 */
export declare function isArrayLikeType(type: ts.Type, services: RequiredParserServices): boolean;
/**
 * Test if the provided type is an array of strings.
 * @param type A TypeScript type.
 * @param services The services used to get access to the TypeScript type checker
 */
export declare function isStringArray(type: ts.Type, services: RequiredParserServices): boolean;
/**
 * Test if the provided type is an array of numbers.
 * @param type A TypeScript type.
 * @param services The services used to get access to the TypeScript type checker
 */
export declare function isNumberArray(type: ts.Type, services: RequiredParserServices): boolean;
/**
 * Test if the provided type is an array of big integers.
 * @param type A TypeScript type.
 * @param services The services used to get access to the TypeScript type checker
 */
export declare function isBigIntArray(type: ts.Type, services: RequiredParserServices): boolean;
/**
 * Checks whether a TypeScript type node denotes a type alias.
 * @param node a type node to check
 * @param context the rule context
 */
export declare function isTypeAlias(node: TSESTree.TypeNode, context: Rule.RuleContext): boolean | undefined;
export declare function isBooleanLiteralType(type: ts.Type): type is ts.Type & {
    intrinsicName: 'true' | 'false';
};
export declare function isBooleanTrueType(type: ts.Type): boolean;
export declare function isBooleanType({ flags }: ts.Type): number;
export declare function isNullOrUndefinedType({ flags }: ts.Type): number;
export declare function isObjectType({ flags }: ts.Type): number;
