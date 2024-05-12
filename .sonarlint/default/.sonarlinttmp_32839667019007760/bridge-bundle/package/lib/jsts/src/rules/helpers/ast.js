"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isThisExpression = exports.getSimpleRawStringValue = exports.isSimpleRawString = exports.isStaticTemplateLiteral = exports.isObjectDestructuring = exports.isIndexNotation = exports.isDotNotation = exports.isRegexLiteral = exports.isNumberLiteral = exports.isBooleanLiteral = exports.isStringLiteral = exports.checkSensitiveCall = exports.resolveFunction = exports.resolveFromFunctionReference = exports.getProperty = exports.getPropertyWithValue = exports.getObjectExpressionProperty = exports.resolveIdentifiers = exports.flattenArgs = exports.getVariableFromName = exports.getVariableFromScope = exports.getLhsVariable = exports.getValueOfExpression = exports.getUniqueWriteUsageOrNode = exports.getUniqueWriteReference = exports.getUniqueWriteUsage = exports.isReferenceTo = exports.isElementWrite = exports.isUndefined = exports.isFalseLiteral = exports.isNullLiteral = exports.isLiteral = exports.isFunctionNode = exports.isModuleExports = exports.isDefaultSpecifier = exports.isNamespaceSpecifier = exports.isCallingMethod = exports.isMethodCall = exports.isFunctionCall = exports.isFunctionInvocation = exports.isMethodInvocation = exports.isRequireModule = exports.isArrayExpression = exports.isUnaryExpression = exports.isBinaryPlus = exports.isMemberExpression = exports.isMemberWithProperty = exports.isIdentifier = exports.functionLike = exports.FUNCTION_NODES = void 0;
exports.isUnresolved = exports.isProperty = void 0;
const _1 = require(".");
exports.FUNCTION_NODES = [
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
];
exports.functionLike = new Set([
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression',
    'MethodDefinition',
]);
function isIdentifier(node, ...values) {
    return (node?.type === 'Identifier' &&
        (values.length === 0 || values.some(value => value === node.name)));
}
exports.isIdentifier = isIdentifier;
function isMemberWithProperty(node, ...values) {
    return node.type === 'MemberExpression' && isIdentifier(node.property, ...values);
}
exports.isMemberWithProperty = isMemberWithProperty;
function isMemberExpression(node, objectValue, ...propertyValue) {
    if (node.type === 'MemberExpression') {
        const { object, property } = node;
        if (isIdentifier(object, objectValue) && isIdentifier(property, ...propertyValue)) {
            return true;
        }
    }
    return false;
}
exports.isMemberExpression = isMemberExpression;
function isBinaryPlus(node) {
    return node.type === 'BinaryExpression' && node.operator === '+';
}
exports.isBinaryPlus = isBinaryPlus;
function isUnaryExpression(node) {
    return node !== undefined && node.type === 'UnaryExpression';
}
exports.isUnaryExpression = isUnaryExpression;
function isArrayExpression(node) {
    return node !== undefined && node.type === 'ArrayExpression';
}
exports.isArrayExpression = isArrayExpression;
function isRequireModule(node, ...moduleNames) {
    if (isIdentifier(node.callee, 'require') && node.arguments.length === 1) {
        const argument = node.arguments[0];
        if (argument.type === 'Literal') {
            return moduleNames.includes(String(argument.value));
        }
    }
    return false;
}
exports.isRequireModule = isRequireModule;
function isMethodInvocation(callExpression, objectIdentifierName, methodName, minArgs) {
    return (callExpression.callee.type === 'MemberExpression' &&
        isIdentifier(callExpression.callee.object, objectIdentifierName) &&
        isIdentifier(callExpression.callee.property, methodName) &&
        callExpression.callee.property.type === 'Identifier' &&
        callExpression.arguments.length >= minArgs);
}
exports.isMethodInvocation = isMethodInvocation;
function isFunctionInvocation(callExpression, functionName, minArgs) {
    return (callExpression.callee.type === 'Identifier' &&
        isIdentifier(callExpression.callee, functionName) &&
        callExpression.arguments.length >= minArgs);
}
exports.isFunctionInvocation = isFunctionInvocation;
function isFunctionCall(node) {
    return node.type === 'CallExpression' && node.callee.type === 'Identifier';
}
exports.isFunctionCall = isFunctionCall;
function isMethodCall(callExpr) {
    return (callExpr.callee.type === 'MemberExpression' &&
        !callExpr.callee.computed &&
        callExpr.callee.property.type === 'Identifier');
}
exports.isMethodCall = isMethodCall;
function isCallingMethod(callExpr, arity, ...methodNames) {
    return (isMethodCall(callExpr) &&
        callExpr.arguments.length === arity &&
        methodNames.includes(callExpr.callee.property.name));
}
exports.isCallingMethod = isCallingMethod;
function isNamespaceSpecifier(importDeclaration, name) {
    return importDeclaration.specifiers.some(({ type, local }) => type === 'ImportNamespaceSpecifier' && local.name === name);
}
exports.isNamespaceSpecifier = isNamespaceSpecifier;
function isDefaultSpecifier(importDeclaration, name) {
    return importDeclaration.specifiers.some(({ type, local }) => type === 'ImportDefaultSpecifier' && local.name === name);
}
exports.isDefaultSpecifier = isDefaultSpecifier;
function isModuleExports(node) {
    return (node.type === 'MemberExpression' &&
        node.object.type === 'Identifier' &&
        node.object.name === 'module' &&
        node.property.type === 'Identifier' &&
        node.property.name === 'exports');
}
exports.isModuleExports = isModuleExports;
function isFunctionNode(node) {
    return exports.FUNCTION_NODES.includes(node.type);
}
exports.isFunctionNode = isFunctionNode;
// we have similar function in eslint-plugin-sonarjs, however this one accepts null
// eventually we should update eslint-plugin-sonarjs
function isLiteral(n) {
    return n != null && n.type === 'Literal';
}
exports.isLiteral = isLiteral;
function isNullLiteral(n) {
    return isLiteral(n) && n.value === null;
}
exports.isNullLiteral = isNullLiteral;
function isFalseLiteral(n) {
    return isLiteral(n) && n.value === false;
}
exports.isFalseLiteral = isFalseLiteral;
function isUndefined(node) {
    return node.type === 'Identifier' && node.name === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * Detect expression statements like the following:
 *  myArray[1] = 42;
 *  myArray[1] += 42;
 *  myObj.prop1 = 3;
 *  myObj.prop1 += 3;
 */
function isElementWrite(statement, ref) {
    if (statement.expression.type === 'AssignmentExpression') {
        const assignmentExpression = statement.expression;
        const lhs = assignmentExpression.left;
        return isMemberExpressionReference(lhs, ref);
    }
    return false;
}
exports.isElementWrite = isElementWrite;
function isMemberExpressionReference(lhs, ref) {
    return (lhs.type === 'MemberExpression' &&
        (isReferenceTo(ref, lhs.object) || isMemberExpressionReference(lhs.object, ref)));
}
function isReferenceTo(ref, node) {
    return node.type === 'Identifier' && node === ref.identifier;
}
exports.isReferenceTo = isReferenceTo;
function getUniqueWriteUsage(context, name) {
    const variable = getVariableFromName(context, name);
    return getUniqueWriteReference(variable);
}
exports.getUniqueWriteUsage = getUniqueWriteUsage;
function getUniqueWriteReference(variable) {
    if (variable) {
        const writeReferences = variable.references.filter(reference => reference.isWrite());
        if (writeReferences.length === 1 && writeReferences[0].writeExpr) {
            return writeReferences[0].writeExpr;
        }
    }
    return undefined;
}
exports.getUniqueWriteReference = getUniqueWriteReference;
function getUniqueWriteUsageOrNode(context, node, recursive = false) {
    if (node.type === 'Identifier') {
        const usage = getUniqueWriteUsage(context, node.name);
        if (usage) {
            return recursive ? getUniqueWriteUsageOrNode(context, usage, recursive) : usage;
        }
        else {
            return node;
        }
    }
    else {
        return node;
    }
}
exports.getUniqueWriteUsageOrNode = getUniqueWriteUsageOrNode;
function getValueOfExpression(context, expr, type, recursive = false) {
    if (!expr) {
        return undefined;
    }
    if (isNodeType(expr, type)) {
        return expr;
    }
    if (expr.type === 'Identifier') {
        const usage = getUniqueWriteUsage(context, expr.name);
        if (usage) {
            if (isNodeType(usage, type)) {
                return usage;
            }
            if (recursive) {
                return getValueOfExpression(context, usage, type, true);
            }
        }
    }
    return undefined;
}
exports.getValueOfExpression = getValueOfExpression;
// see https://stackoverflow.com/questions/64262105/narrowing-return-value-of-function-based-on-argument
function isNodeType(node, type) {
    return node.type === type;
}
/**
 * for `x = 42` or `let x = 42` when visiting '42' returns 'x' variable
 */
function getLhsVariable(context) {
    const parent = context.getAncestors()[context.getAncestors().length - 1];
    let formIdentifier;
    if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
        formIdentifier = parent.id;
    }
    else if (parent.type === 'AssignmentExpression' && parent.left.type === 'Identifier') {
        formIdentifier = parent.left;
    }
    if (formIdentifier) {
        return getVariableFromName(context, formIdentifier.name);
    }
    return undefined;
}
exports.getLhsVariable = getLhsVariable;
function getVariableFromScope(scope, name) {
    let variable;
    while (variable == null && scope != null) {
        variable = scope.variables.find(value => value.name === name);
        scope = scope.upper;
    }
    return variable;
}
exports.getVariableFromScope = getVariableFromScope;
function getVariableFromName(context, name) {
    const scope = context.getScope();
    return getVariableFromScope(scope, name);
}
exports.getVariableFromName = getVariableFromName;
/**
 * Takes array of arguments. Keeps following variable definitions
 * and unpacking arrays as long as possible. Returns flattened
 * array with all collected nodes.
 *
 * A usage example should clarify why this might be useful.
 * According to ExpressJs `app.use` spec, the arguments can be:
 *
 * - A middleware function.
 * - A series of middleware functions (separated by commas).
 * - An array of middleware functions.
 * - A combination of all of the above.
 *
 * This means that methods like `app.use` accept variable arguments,
 * but also arrays, or combinations thereof. This methods helps
 * to flatten out such complicated composed argument lists.
 */
function flattenArgs(context, args) {
    // Invokes `getUniqueWriteUsageOrNode` at most once, from then on
    // only flattens arrays.
    function recHelper(nodePossiblyIdentifier) {
        const n = getUniqueWriteUsageOrNode(context, nodePossiblyIdentifier);
        if (n.type === 'ArrayExpression') {
            return (0, _1.flatMap)(n.elements, recHelper);
        }
        else {
            return [n];
        }
    }
    return (0, _1.flatMap)(args, recHelper);
}
exports.flattenArgs = flattenArgs;
function resolveIdentifiers(node, acceptShorthand = false) {
    const identifiers = [];
    resolveIdentifiersAcc(node, identifiers, acceptShorthand);
    return identifiers;
}
exports.resolveIdentifiers = resolveIdentifiers;
function resolveIdentifiersAcc(node, identifiers, acceptShorthand) {
    if (!node) {
        return;
    }
    switch (node.type) {
        case 'Identifier':
            identifiers.push(node);
            break;
        case 'ObjectPattern':
            node.properties.forEach(prop => resolveIdentifiersAcc(prop, identifiers, acceptShorthand));
            break;
        case 'ArrayPattern':
            node.elements.forEach(elem => elem && resolveIdentifiersAcc(elem, identifiers, acceptShorthand));
            break;
        case 'Property':
            if (acceptShorthand || !node.shorthand) {
                resolveIdentifiersAcc(node.value, identifiers, acceptShorthand);
            }
            break;
        case 'RestElement':
            resolveIdentifiersAcc(node.argument, identifiers, acceptShorthand);
            break;
        case 'AssignmentPattern':
            resolveIdentifiersAcc(node.left, identifiers, acceptShorthand);
            break;
        case 'TSParameterProperty':
            resolveIdentifiersAcc(node.parameter, identifiers, acceptShorthand);
            break;
    }
}
function getObjectExpressionProperty(node, propertyKey) {
    if (node?.type === 'ObjectExpression') {
        const properties = node.properties.filter(p => p.type === 'Property' &&
            (isIdentifier(p.key, propertyKey) || (isLiteral(p.key) && p.key.value === propertyKey)));
        // if property is duplicated, we return the last defined
        return properties[properties.length - 1];
    }
    return undefined;
}
exports.getObjectExpressionProperty = getObjectExpressionProperty;
function getPropertyWithValue(context, objectExpression, propertyName, propertyValue) {
    const maybeProperty = getObjectExpressionProperty(objectExpression, propertyName);
    if (maybeProperty) {
        const maybePropertyValue = getValueOfExpression(context, maybeProperty.value, 'Literal');
        if (maybePropertyValue?.value === propertyValue) {
            return maybeProperty;
        }
    }
    return undefined;
}
exports.getPropertyWithValue = getPropertyWithValue;
function getProperty(expr, key, ctx) {
    let unresolvedSpreadElement = false;
    for (let i = expr.properties.length - 1; i >= 0; --i) {
        const property = expr.properties[i];
        if (isProperty(property, key)) {
            return property;
        }
        if (property.type === 'SpreadElement') {
            const props = getValueOfExpression(ctx, property.argument, 'ObjectExpression');
            if (props !== undefined) {
                const prop = getProperty(props, key, ctx);
                if (prop !== null) {
                    return prop;
                }
            }
            else {
                unresolvedSpreadElement = true;
            }
        }
    }
    if (unresolvedSpreadElement) {
        return undefined;
    }
    return null;
    function isProperty(node, key) {
        return (node.type === 'Property' &&
            (isIdentifier(node.key, key) || (isStringLiteral(node.key) && node.key.value === key)));
    }
}
exports.getProperty = getProperty;
function resolveFromFunctionReference(context, functionIdentifier) {
    const { scopeManager } = context.sourceCode;
    for (const scope of scopeManager.scopes) {
        const reference = scope.references.find(r => r.identifier === functionIdentifier);
        if (reference?.resolved &&
            reference.resolved.defs.length === 1 &&
            reference.resolved.defs[0].type === 'FunctionName') {
            return reference.resolved.defs[0].node;
        }
    }
    return null;
}
exports.resolveFromFunctionReference = resolveFromFunctionReference;
function resolveFunction(context, node) {
    if (isFunctionNode(node)) {
        return node;
    }
    else if (node.type === 'Identifier') {
        return resolveFromFunctionReference(context, node);
    }
    else {
        return null;
    }
}
exports.resolveFunction = resolveFunction;
function checkSensitiveCall(context, callExpression, sensitiveArgumentIndex, sensitiveProperty, sensitivePropertyValue, message) {
    if (callExpression.arguments.length < sensitiveArgumentIndex + 1) {
        return;
    }
    const sensitiveArgument = callExpression.arguments[sensitiveArgumentIndex];
    const options = getValueOfExpression(context, sensitiveArgument, 'ObjectExpression');
    if (!options) {
        return;
    }
    const unsafeProperty = getPropertyWithValue(context, options, sensitiveProperty, sensitivePropertyValue);
    if (unsafeProperty) {
        context.report({
            node: callExpression.callee,
            message: (0, _1.toEncodedMessage)(message, [unsafeProperty]),
        });
    }
}
exports.checkSensitiveCall = checkSensitiveCall;
function isStringLiteral(node) {
    return isLiteral(node) && typeof node.value === 'string';
}
exports.isStringLiteral = isStringLiteral;
function isBooleanLiteral(node) {
    return isLiteral(node) && typeof node.value === 'boolean';
}
exports.isBooleanLiteral = isBooleanLiteral;
function isNumberLiteral(node) {
    return isLiteral(node) && typeof node.value === 'number';
}
exports.isNumberLiteral = isNumberLiteral;
function isRegexLiteral(node) {
    return node.type === 'Literal' && node.value instanceof RegExp;
}
exports.isRegexLiteral = isRegexLiteral;
/**
 * Checks if the node is of the form: foo.bar
 *
 * @param node
 * @returns
 */
function isDotNotation(node) {
    return node.type === 'MemberExpression' && !node.computed && node.property.type === 'Identifier';
}
exports.isDotNotation = isDotNotation;
/**
 * Checks if the node is of the form: foo["bar"]
 *
 * @param node
 * @returns
 */
function isIndexNotation(node) {
    return node.type === 'MemberExpression' && node.computed && isStringLiteral(node.property);
}
exports.isIndexNotation = isIndexNotation;
function isObjectDestructuring(node) {
    return ((node.type === 'VariableDeclarator' && node.id.type === 'ObjectPattern') ||
        (node.type === 'AssignmentExpression' && node.left.type === 'ObjectPattern'));
}
exports.isObjectDestructuring = isObjectDestructuring;
function isStaticTemplateLiteral(node) {
    return (node.type === 'TemplateLiteral' && node.expressions.length === 0 && node.quasis.length === 1);
}
exports.isStaticTemplateLiteral = isStaticTemplateLiteral;
// Test for raw expressions like: String.raw`c:\foo\bar.txt` that corresponds to 'c:\\foo\\bar.txt'
function isSimpleRawString(node) {
    return (node.type === 'TaggedTemplateExpression' &&
        isDotNotation(node.tag) &&
        isIdentifier(node.tag.object, 'String') &&
        isIdentifier(node.tag.property, 'raw') &&
        isStaticTemplateLiteral(node.quasi));
}
exports.isSimpleRawString = isSimpleRawString;
// In simple raw strings, the literal value is: node.quasi.quasis[0].value.raw
// This function fails if isSimpleRawString() is not returning true for the node.
function getSimpleRawStringValue(node) {
    return node.quasi.quasis[0].value.raw;
}
exports.getSimpleRawStringValue = getSimpleRawStringValue;
function isThisExpression(node) {
    return node.type === 'ThisExpression';
}
exports.isThisExpression = isThisExpression;
function isProperty(node) {
    return node.type === 'Property';
}
exports.isProperty = isProperty;
/**
 * Check if an identifier has no known value, meaning:
 *
 * - It's not imported/required
 * - Defined variable without any write references (function parameter?)
 * - Non-defined variable (a possible global?)
 *
 * @param node Node to check
 * @param ctx Rule context
 */
function isUnresolved(node, ctx) {
    if (!node || (0, _1.getFullyQualifiedName)(ctx, node) || isUndefined(node)) {
        return false;
    }
    let nodeToCheck = node;
    while (nodeToCheck.type === 'MemberExpression') {
        nodeToCheck = nodeToCheck.object;
    }
    if (nodeToCheck.type === 'Identifier') {
        const variable = getVariableFromName(ctx, nodeToCheck.name);
        const writeReferences = variable?.references.filter(reference => reference.isWrite());
        if (!variable || !writeReferences?.length) {
            return true;
        }
    }
    return false;
}
exports.isUnresolved = isUnresolved;
//# sourceMappingURL=ast.js.map