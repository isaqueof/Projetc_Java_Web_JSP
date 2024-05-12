"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectType = exports.isNullOrUndefinedType = exports.isBooleanType = exports.isBooleanTrueType = exports.isBooleanLiteralType = exports.isTypeAlias = exports.isBigIntArray = exports.isNumberArray = exports.isStringArray = exports.isArrayLikeType = exports.getSignatureFromCallee = exports.getSymbolAtLocation = exports.getTypeAsString = exports.getTypeFromTreeNode = exports.isGenericType = exports.isAny = exports.isThenable = exports.isUndefinedOrNull = exports.getUnionTypes = exports.isUnion = exports.isFunction = exports.isStringType = exports.isNumberType = exports.isBigIntType = exports.isNumber = exports.isString = exports.isTypedArray = exports.TYPED_ARRAY_TYPES = exports.UTILITY_TYPES = exports.isArray = void 0;
const typescript_1 = __importDefault(require("typescript"));
const ast_1 = require("./ast");
function isArray(node, services) {
    const type = getTypeFromTreeNode(node, services);
    return type.symbol?.name === 'Array';
}
exports.isArray = isArray;
/**
 * TypeScript provides a set of utility types to facilitate type transformations.
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html
 */
exports.UTILITY_TYPES = new Set([
    'Awaited',
    'Partial',
    'Required',
    'Readonly',
    'Record',
    'Pick',
    'Omit',
    'Exclude',
    'Extract',
    'NonNullable',
    'Parameters',
    'ConstructorParameters',
    'ReturnType',
    'InstanceType',
    'ThisParameterType',
    'OmitThisParameter',
    'ThisType',
    'Uppercase',
    'Lowercase',
    'Capitalize',
    'Uncapitalize',
]);
/**
 * JavaScript typed arrays
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays
 */
exports.TYPED_ARRAY_TYPES = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array',
];
/**
 * Checks if the provided node is a JS typed array like "BigInt64Array". See TYPED_ARRAY_TYPES
 *
 * @param node
 * @param services
 * @returns
 */
function isTypedArray(node, services) {
    const type = getTypeFromTreeNode(node, services);
    return exports.TYPED_ARRAY_TYPES.includes(type.symbol?.name);
}
exports.isTypedArray = isTypedArray;
function isString(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return (typ.getFlags() & typescript_1.default.TypeFlags.StringLike) !== 0;
}
exports.isString = isString;
function isNumber(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return (typ.getFlags() & typescript_1.default.TypeFlags.NumberLike) !== 0;
}
exports.isNumber = isNumber;
function isBigIntType(type) {
    return (type.getFlags() & typescript_1.default.TypeFlags.BigIntLike) !== 0;
}
exports.isBigIntType = isBigIntType;
function isNumberType(type) {
    return (type.getFlags() & typescript_1.default.TypeFlags.NumberLike) !== 0;
}
exports.isNumberType = isNumberType;
function isStringType(type) {
    return (type.flags & typescript_1.default.TypeFlags.StringLike) > 0 || type.symbol?.name === 'String';
}
exports.isStringType = isStringType;
function isFunction(node, services) {
    const checker = services.program.getTypeChecker();
    const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return type.symbol && (type.symbol.flags & typescript_1.default.SymbolFlags.Function) !== 0;
}
exports.isFunction = isFunction;
function isUnion(node, services) {
    const checker = services.program.getTypeChecker();
    const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return type.isUnion();
}
exports.isUnion = isUnion;
/**
 * Returns an array of the union types if the provided type is a union.
 * Otherwise, returns an array containing the provided type as its unique element.
 * @param type A TypeScript type.
 * @return An array of types. It's never empty.
 */
function getUnionTypes(type) {
    return type.isUnion() ? type.types : [type];
}
exports.getUnionTypes = getUnionTypes;
function isUndefinedOrNull(node, services) {
    const checker = services.program.getTypeChecker();
    const typ = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
    return ((typ.getFlags() & typescript_1.default.TypeFlags.Undefined) !== 0 || (typ.getFlags() & typescript_1.default.TypeFlags.Null) !== 0);
}
exports.isUndefinedOrNull = isUndefinedOrNull;
function isThenable(node, services) {
    const mapped = services.esTreeNodeToTSNodeMap.get(node);
    const tp = services.program.getTypeChecker().getTypeAtLocation(mapped);
    const thenProperty = tp.getProperty('then');
    return Boolean(thenProperty && thenProperty.flags & typescript_1.default.SymbolFlags.Method);
}
exports.isThenable = isThenable;
function isAny(type) {
    return type.flags === typescript_1.default.TypeFlags.Any;
}
exports.isAny = isAny;
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
function isGenericType(node, services) {
    const type = getTypeFromTreeNode(node, services);
    return type.isTypeParameter();
}
exports.isGenericType = isGenericType;
function getTypeFromTreeNode(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getTypeFromTreeNode = getTypeFromTreeNode;
function getTypeAsString(node, services) {
    const { typeToString, getBaseTypeOfLiteralType } = services.program.getTypeChecker();
    return typeToString(getBaseTypeOfLiteralType(getTypeFromTreeNode(node, services)));
}
exports.getTypeAsString = getTypeAsString;
function getSymbolAtLocation(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getSymbolAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSymbolAtLocation = getSymbolAtLocation;
function getSignatureFromCallee(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getResolvedSignature(services.esTreeNodeToTSNodeMap.get(node));
}
exports.getSignatureFromCallee = getSignatureFromCallee;
/**
 * This function checks if a type may correspond to an array type. Beyond simple array types, it will also
 * consider the union of array types and generic types extending an array type.
 * @param type A type to check
 * @param services The services used to get access to the TypeScript type checker
 */
function isArrayLikeType(type, services) {
    const checker = services.program.getTypeChecker();
    const constrained = checker.getBaseConstraintOfType(type);
    return isArrayOrUnionOfArrayType(constrained ?? type, services);
}
exports.isArrayLikeType = isArrayLikeType;
function isArrayOrUnionOfArrayType(type, services) {
    for (const part of getUnionTypes(type)) {
        if (!isArrayType(part, services)) {
            return false;
        }
    }
    return true;
}
/**
 * Test if the provided type is an array of strings.
 * @param type A TypeScript type.
 * @param services The services used to get access to the TypeScript type checker
 */
function isStringArray(type, services) {
    return isArrayElementTypeMatching(type, services, isStringType);
}
exports.isStringArray = isStringArray;
/**
 * Test if the provided type is an array of numbers.
 * @param type A TypeScript type.
 * @param services The services used to get access to the TypeScript type checker
 */
function isNumberArray(type, services) {
    return isArrayElementTypeMatching(type, services, isNumberType);
}
exports.isNumberArray = isNumberArray;
/**
 * Test if the provided type is an array of big integers.
 * @param type A TypeScript type.
 * @param services The services used to get access to the TypeScript type checker
 */
function isBigIntArray(type, services) {
    return isArrayElementTypeMatching(type, services, isBigIntType);
}
exports.isBigIntArray = isBigIntArray;
function isArrayElementTypeMatching(type, services, predicate) {
    const checker = services.program.getTypeChecker();
    if (!isArrayType(type, services)) {
        return false;
    }
    const [elementType] = checker.getTypeArguments(type);
    return elementType && predicate(elementType);
}
// Internal TS API
function isArrayType(type, services) {
    const checker = services.program.getTypeChecker();
    return ('isArrayType' in checker &&
        typeof checker.isArrayType === 'function' &&
        checker.isArrayType(type));
}
/**
 * Checks whether a TypeScript type node denotes a type alias.
 * @param node a type node to check
 * @param context the rule context
 */
function isTypeAlias(node, context) {
    if (node.type !== 'TSTypeReference' ||
        node.typeName.type !== 'Identifier' ||
        node.typeArguments) {
        return false;
    }
    const scope = context.getScope();
    const variable = (0, ast_1.getVariableFromScope)(scope, node.typeName.name);
    return variable?.defs.some(def => def.node.type === 'TSTypeAliasDeclaration');
}
exports.isTypeAlias = isTypeAlias;
function isBooleanLiteralType(type) {
    return type.flags === typescript_1.default.TypeFlags.BooleanLiteral;
}
exports.isBooleanLiteralType = isBooleanLiteralType;
function isBooleanTrueType(type) {
    return isBooleanLiteralType(type) && type.intrinsicName === 'true';
}
exports.isBooleanTrueType = isBooleanTrueType;
function isBooleanType({ flags }) {
    return flags & typescript_1.default.TypeFlags.BooleanLike;
}
exports.isBooleanType = isBooleanType;
function isNullOrUndefinedType({ flags }) {
    return flags & typescript_1.default.TypeFlags.Null || flags & typescript_1.default.TypeFlags.Undefined;
}
exports.isNullOrUndefinedType = isNullOrUndefinedType;
function isObjectType({ flags }) {
    return flags & typescript_1.default.TypeFlags.Object;
}
exports.isObjectType = isObjectType;
//# sourceMappingURL=type.js.map