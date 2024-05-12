"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMessage = void 0;
const quickfixes_1 = require("../quickfixes");
const shared_1 = require("@sonar/shared");
/**
 * Converts an ESLint message into a SonarQube issue
 *
 * Converting an ESLint message into a SonarQube issue consists in extracting
 * the relevant properties from the message for the most of it. Furthermore,
 * it transforms ESLint fixes into SonarLint quick fixes, if any. On the other
 * hand, encoded secondary locations remain in the issue message at this stage
 * and are decoded in a subsequent step.
 *
 * @param source the source code
 * @param message the ESLint message to convert
 * @returns the converted SonarQube issue
 */
function convertMessage(source, message) {
    /**
     * The property `ruleId` equals `null` on parsing errors, but it should not
     * happen because we lint ready SourceCode instances and not file contents.
     */
    if (!message.ruleId) {
        (0, shared_1.error)("Illegal 'null' ruleId for eslint issue");
        return null;
    }
    return {
        ruleId: message.ruleId,
        line: message.line,
        column: message.column,
        endLine: message.endLine,
        endColumn: message.endColumn,
        message: message.message,
        quickFixes: (0, quickfixes_1.transformFixes)(source, message),
        secondaryLocations: [],
    };
}
exports.convertMessage = convertMessage;
//# sourceMappingURL=message.js.map