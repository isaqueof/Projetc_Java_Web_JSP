"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const linter_1 = require("../../linter");
const helpers_1 = require("../helpers");
/**
 * We assume that the user is using a single assertion library per file,
 * this is why we are not saving if an assertion has been performed for
 * libX and the imported library was libY.
 */
exports.rule = {
    create(context) {
        const visitedNodes = new Set();
        const potentialIssues = [];
        return {
            'CallExpression:exit': (node) => {
                const testCase = helpers_1.Mocha.extractTestCase(node);
                if (testCase !== null) {
                    checkAssertions(testCase, context, potentialIssues, visitedNodes);
                }
            },
            'Program:exit': () => {
                if (helpers_1.Chai.isImported(context) || helpers_1.Sinon.isImported(context) || helpers_1.Vitest.isImported(context)) {
                    potentialIssues.forEach(issue => {
                        context.report(issue);
                    });
                }
            },
        };
    },
};
function checkAssertions(testCase, context, potentialIssues, visitedNodes) {
    const { node, callback } = testCase;
    const visitor = new TestCaseAssertionVisitor(context);
    visitor.visit(context, callback.body, visitedNodes);
    if (visitor.missingAssertions()) {
        potentialIssues.push({ node, message: 'Add at least one assertion to this test case.' });
    }
}
class TestCaseAssertionVisitor {
    constructor(context) {
        this.context = context;
        this.visitorKeys = context.sourceCode.visitorKeys;
        this.hasAssertions = false;
    }
    visit(context, node, visitedNodes) {
        if (visitedNodes.has(node)) {
            return;
        }
        visitedNodes.add(node);
        if (this.hasAssertions) {
            return;
        }
        if (helpers_1.Chai.isAssertion(context, node) ||
            helpers_1.Sinon.isAssertion(context, node) ||
            helpers_1.Vitest.isAssertion(context, node)) {
            this.hasAssertions = true;
            return;
        }
        if ((0, helpers_1.isFunctionCall)(node)) {
            const functionDef = (0, helpers_1.resolveFunction)(this.context, node.callee);
            if (functionDef) {
                this.visit(context, functionDef.body, visitedNodes);
            }
        }
        for (const child of (0, linter_1.childrenOf)(node, this.visitorKeys)) {
            this.visit(context, child, visitedNodes);
        }
    }
    missingAssertions() {
        return !this.hasAssertions;
    }
}
//# sourceMappingURL=rule.js.map