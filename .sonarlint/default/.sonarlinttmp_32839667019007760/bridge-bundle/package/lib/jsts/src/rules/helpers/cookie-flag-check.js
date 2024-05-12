"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieFlagCheck = void 0;
const _1 = require(".");
class CookieFlagCheck {
    constructor(context, flag) {
        this.context = context;
        this.flag = flag;
        this.issueMessage = `Make sure creating this cookie without the "${flag}" flag is safe.`;
    }
    checkCookieSession(callExpression) {
        // Sensitive argument for cookie session is first one
        this.checkSensitiveCookieArgument(callExpression, 0);
    }
    checkCookiesMethodCall(callExpression) {
        if (!(0, _1.isIdentifier)(callExpression.callee.property, 'set')) {
            return;
        }
        // Sensitive argument is third argument for "cookies.set" calls
        this.checkSensitiveCookieArgument(callExpression, 2);
    }
    checkCsurf(callExpression) {
        // Sensitive argument is first for csurf
        const cookieProperty = this.checkSensitiveObjectArgument(callExpression, 0);
        if (cookieProperty) {
            // csurf cookie property can be passed as a boolean literal,
            // in which case neither "secure" nor "httponly" are enabled by default
            const cookiePropertyLiteral = (0, _1.getValueOfExpression)(this.context, cookieProperty.value, 'Literal');
            if (cookiePropertyLiteral?.value === true) {
                this.context.report({
                    node: callExpression.callee,
                    message: (0, _1.toEncodedMessage)(this.issueMessage, [cookiePropertyLiteral]),
                });
            }
        }
    }
    checkExpressSession(callExpression) {
        // Sensitive argument is first for express-session
        this.checkSensitiveObjectArgument(callExpression, 0);
    }
    checkSensitiveCookieArgument(callExpression, sensitiveArgumentIndex) {
        if (callExpression.arguments.length < sensitiveArgumentIndex + 1) {
            return;
        }
        const sensitiveArgument = callExpression.arguments[sensitiveArgumentIndex];
        const cookieObjectExpression = (0, _1.getValueOfExpression)(this.context, sensitiveArgument, 'ObjectExpression');
        if (!cookieObjectExpression) {
            return;
        }
        this.checkFlagOnCookieExpression(cookieObjectExpression, sensitiveArgument, cookieObjectExpression, callExpression);
    }
    checkSensitiveObjectArgument(callExpression, argumentIndex) {
        if (callExpression.arguments.length < argumentIndex + 1) {
            return;
        }
        const firstArgument = callExpression.arguments[argumentIndex];
        const objectExpression = (0, _1.getValueOfExpression)(this.context, firstArgument, 'ObjectExpression');
        if (!objectExpression) {
            return;
        }
        const cookieProperty = (0, _1.getObjectExpressionProperty)(objectExpression, 'cookie');
        if (!cookieProperty) {
            return;
        }
        const cookiePropertyValue = (0, _1.getValueOfExpression)(this.context, cookieProperty.value, 'ObjectExpression');
        if (cookiePropertyValue) {
            this.checkFlagOnCookieExpression(cookiePropertyValue, firstArgument, objectExpression, callExpression);
            return;
        }
        return cookieProperty;
    }
    checkFlagOnCookieExpression(cookiePropertyValue, firstArgument, objectExpression, callExpression) {
        const flagProperty = (0, _1.getObjectExpressionProperty)(cookiePropertyValue, this.flag);
        if (flagProperty) {
            const flagPropertyValue = (0, _1.getValueOfExpression)(this.context, flagProperty.value, 'Literal');
            if (flagPropertyValue?.value === false) {
                const secondaryLocations = [flagPropertyValue];
                if (firstArgument !== objectExpression) {
                    secondaryLocations.push(objectExpression);
                }
                this.context.report({
                    node: callExpression.callee,
                    message: (0, _1.toEncodedMessage)(this.issueMessage, secondaryLocations),
                });
            }
        }
    }
    checkCookiesFromCallExpression(node) {
        const callExpression = node;
        const { callee } = callExpression;
        const fqn = (0, _1.getFullyQualifiedName)(this.context, callee);
        if (fqn === 'cookie-session') {
            this.checkCookieSession(callExpression);
            return;
        }
        if (fqn === 'csurf') {
            this.checkCsurf(callExpression);
            return;
        }
        if (fqn === 'express-session') {
            this.checkExpressSession(callExpression);
            return;
        }
        if (callee.type === 'MemberExpression') {
            const objectValue = (0, _1.getValueOfExpression)(this.context, callee.object, 'NewExpression');
            if (objectValue && (0, _1.getFullyQualifiedName)(this.context, objectValue.callee) === 'cookies') {
                this.checkCookiesMethodCall(callExpression);
            }
        }
    }
}
exports.CookieFlagCheck = CookieFlagCheck;
//# sourceMappingURL=cookie-flag-check.js.map