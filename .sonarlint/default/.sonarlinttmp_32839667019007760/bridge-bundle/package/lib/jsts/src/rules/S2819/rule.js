"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://sonarsource.github.io/rspec/#/rspec/S2819/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const linter_1 = require("../../linter");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
const POST_MESSAGE = 'postMessage';
const ADD_EVENT_LISTENER = 'addEventListener';
exports.rule = {
    meta: {
        messages: {
            specifyTarget: `Specify a target origin for this message.`,
            verifyOrigin: `Verify the origin of the received message.`,
        },
    },
    create(context) {
        const services = context.sourceCode.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            [`CallExpression:matches([callee.name="${POST_MESSAGE}"], [callee.property.name="${POST_MESSAGE}"])`]: (node) => {
                checkPostMessageCall(node, context);
            },
            [`CallExpression[callee.property.name="${ADD_EVENT_LISTENER}"]`]: (node) => {
                checkAddEventListenerCall(node, context);
            },
        };
    },
};
function isWindowObject(node, context) {
    const type = (0, helpers_1.getTypeAsString)(node, context.sourceCode.parserServices);
    const hasWindowName = WindowNameVisitor.containsWindowName(node, context);
    return type.match(/window/i) || type.match(/globalThis/i) || hasWindowName;
}
function checkPostMessageCall(callExpr, context) {
    const { callee } = callExpr;
    // Window.postMessage() can take 2 or 3 arguments
    if (![2, 3].includes(callExpr.arguments.length) ||
        (0, helpers_1.getValueOfExpression)(context, callExpr.arguments[1], 'Literal')?.value !== '*') {
        return;
    }
    if (callee.type === 'Identifier') {
        context.report({
            node: callee,
            messageId: 'specifyTarget',
        });
    }
    if (callee.type !== 'MemberExpression') {
        return;
    }
    if (isWindowObject(callee.object, context)) {
        context.report({
            node: callee,
            messageId: 'specifyTarget',
        });
    }
}
function checkAddEventListenerCall(callExpr, context) {
    const { callee, arguments: args } = callExpr;
    if (!isWindowObject(callee, context) ||
        args.length < 2 ||
        !isMessageTypeEvent(args[0], context)) {
        return;
    }
    let listener = (0, helpers_1.resolveFunction)(context, args[1]);
    if (listener?.body.type === 'CallExpression') {
        listener = (0, helpers_1.resolveFunction)(context, listener.body);
    }
    if (!listener || listener.params.length === 0) {
        return;
    }
    const event = listener.params[0];
    if (event.type !== 'Identifier') {
        return;
    }
    if (!hasVerifiedOrigin(context, listener, event)) {
        context.report({
            node: callee,
            messageId: 'verifyOrigin',
        });
    }
}
/**
 * Checks if event.origin or event.originalEvent.origin is verified
 */
function hasVerifiedOrigin(context, listener, event) {
    const scope = context.sourceCode.scopeManager.acquire(listener);
    const eventVariable = scope?.variables.find(v => v.name === event.name);
    if (eventVariable) {
        const eventIdentifiers = eventVariable.references.map(e => e.identifier);
        for (const reference of eventVariable.references) {
            const eventRef = reference.identifier;
            if (isEventOriginCompared(eventRef) || isEventOriginalEventCompared(eventRef)) {
                return true;
            }
            // event OR-ed with event.originalEvent
            const unionEvent = findUnionEvent(eventRef, eventIdentifiers);
            if (unionEvent !== null && isReferenceCompared(scope, unionEvent)) {
                return true;
            }
            // event.origin OR-ed with event.originalEvent.origin
            const unionOrigin = findUnionOrigin(eventRef, eventIdentifiers);
            if (unionOrigin !== null &&
                isEventOriginReferenceCompared(scope, unionOrigin)) {
                return true;
            }
        }
    }
    return false;
    /**
     * Looks for unionEvent = event | event.originalEvent
     */
    function findUnionEvent(event, eventIdentifiers) {
        const logicalExpr = event.parent;
        if (logicalExpr?.type !== 'LogicalExpression') {
            return null;
        }
        if ((logicalExpr.left === event &&
            isEventOriginalEvent(logicalExpr.right, eventIdentifiers)) ||
            (logicalExpr.right === event &&
                isEventOriginalEvent(logicalExpr.left, eventIdentifiers))) {
            return extractVariableDeclaratorIfExists(logicalExpr);
        }
        return null;
    }
    /**
     * looks for unionOrigin = event.origin | event.originalEvent.origin
     */
    function findUnionOrigin(eventRef, eventIdentifiers) {
        const memberExpr = eventRef.parent;
        // looks for event.origin in a LogicalExpr
        if (!(memberExpr?.type === 'MemberExpression' && memberExpr.parent?.type === 'LogicalExpression')) {
            return null;
        }
        const logicalExpr = memberExpr.parent;
        if (!(logicalExpr.left === memberExpr &&
            isEventOriginalEventOrigin(logicalExpr.right, eventIdentifiers)) &&
            !(logicalExpr.right === memberExpr &&
                isEventOriginalEventOrigin(logicalExpr.left, eventIdentifiers))) {
            return null;
        }
        return extractVariableDeclaratorIfExists(logicalExpr);
        /**
         * checks if memberExpr is event.originalEvent.origin
         */
        function isEventOriginalEventOrigin(memberExpr, eventIdentifiers) {
            const subMemberExpr = memberExpr.object;
            if (subMemberExpr?.type !== 'MemberExpression') {
                return false;
            }
            const isOrigin = memberExpr.property.type === 'Identifier' && memberExpr.property.name === 'origin';
            return isEventOriginalEvent(subMemberExpr, eventIdentifiers) && isOrigin;
        }
    }
}
/**
 * Looks for an occurence of the provided node in an IfStatement
 */
function isReferenceCompared(scope, identifier) {
    function getGrandParent(node) {
        return node?.parent?.parent;
    }
    return checkReference(scope, identifier, getGrandParent);
}
/**
 * checks if a reference of identifier is
 * node.identifier
 */
function isEventOriginReferenceCompared(scope, identifier) {
    function getParent(node) {
        return node?.parent;
    }
    return checkReference(scope, identifier, getParent);
}
/**
 *
 */
function checkReference(scope, identifier, callback) {
    const identifierVariable = scope?.variables.find(v => v.name === identifier.name);
    if (!identifierVariable) {
        return false;
    }
    for (const reference of identifierVariable.references) {
        const binaryExpressionCandidate = callback(reference.identifier);
        if (isInIfStatement(binaryExpressionCandidate)) {
            return true;
        }
    }
    return false;
}
/**
 * checks if memberExpr is event.originalEvent
 */
function isEventOriginalEvent(memberExpr, eventIdentifiers) {
    const isEvent = memberExpr.object.type === 'Identifier' &&
        eventIdentifiers.includes(memberExpr.object);
    const isOriginalEvent = memberExpr.property.type === 'Identifier' && memberExpr.property.name === 'originalEvent';
    return isEvent && isOriginalEvent;
}
/**
 * Extracts the identifier to which the 'node' expression is assigned to
 */
function extractVariableDeclaratorIfExists(node) {
    if (node.parent?.type !== 'VariableDeclarator') {
        return null;
    }
    return node.parent.id;
}
/**
 * Looks for an IfStatement with event.origin
 */
function isEventOriginCompared(event) {
    const memberExpr = findEventOrigin(event);
    return isInIfStatement(memberExpr);
}
/**
 * Looks for an IfStatement with event.originalEvent.origin
 */
function isEventOriginalEventCompared(event) {
    const eventOriginalEvent = findEventOriginalEvent(event);
    if (!eventOriginalEvent?.parent) {
        return false;
    }
    if (!isPropertyOrigin(eventOriginalEvent.parent)) {
        return false;
    }
    return isInIfStatement(eventOriginalEvent);
}
/**
 * Returns event.origin MemberExpression, if exists
 */
function findEventOrigin(event) {
    const parent = event.parent;
    if (parent?.type !== 'MemberExpression') {
        return null;
    }
    if (isPropertyOrigin(parent)) {
        return parent;
    }
    else {
        return null;
    }
}
/**
 * Checks if node has a property 'origin'
 */
function isPropertyOrigin(node) {
    return (0, helpers_1.isIdentifier)(node.property, 'origin');
}
/**
 * Returns event.originalEvent MemberExpression, if exists
 */
function findEventOriginalEvent(event) {
    const memberExpr = event.parent;
    if (memberExpr?.type !== 'MemberExpression') {
        return null;
    }
    const { object: eventCandidate, property: originalEventIdentifierCandidate } = memberExpr;
    if (eventCandidate === event &&
        (0, helpers_1.isIdentifier)(originalEventIdentifierCandidate, 'originalEvent')) {
        return memberExpr;
    }
    return null;
}
/**
 * Checks if the current node is nested in an IfStatement
 */
function isInIfStatement(node) {
    // this checks for 'undefined' and 'null', because node.parent can be 'null'
    if (node == null) {
        return false;
    }
    return (0, helpers_1.findFirstMatchingLocalAncestor)(node, nodes_1.isIfStatement) != null;
}
function isMessageTypeEvent(eventNode, context) {
    const eventValue = (0, helpers_1.getValueOfExpression)(context, eventNode, 'Literal');
    return typeof eventValue?.value === 'string' && eventValue.value.toLowerCase() === 'message';
}
class WindowNameVisitor {
    constructor() {
        this.hasWindowName = false;
    }
    static containsWindowName(node, context) {
        const visitor = new WindowNameVisitor();
        visitor.visit(node, context);
        return visitor.hasWindowName;
    }
    visit(root, context) {
        const visitNode = (node) => {
            if (node.type === 'Identifier' && node.name.match(/window/i)) {
                this.hasWindowName = true;
            }
            (0, linter_1.childrenOf)(node, context.sourceCode.visitorKeys).forEach(visitNode);
        };
        visitNode(root);
    }
}
//# sourceMappingURL=rule.js.map