"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSonarRuntime = void 0;
const parameters_1 = require("../parameters");
/**
 * Decodes an issue with secondary locations, if any
 *
 * Decoding an issue with secondary locations consists in checking
 * if the rule definition claims using secondary locations by the
 * definition of the `sonar-runtime` internal parameter. If it is
 * the case, secondary locations are then decoded and a well-formed
 * issue is then returned. Otherwise, the original issue is returned
 * unchanged.
 *
 * @param ruleModule the rule definition
 * @param issue the issue to decode
 * @throws a runtime error in case of an invalid encoding
 * @returns the decoded issue (or the original one)
 */
function decodeSonarRuntime(ruleModule, issue) {
    if ((0, parameters_1.hasSonarRuntimeOption)(ruleModule, issue.ruleId)) {
        try {
            const encodedMessage = JSON.parse(issue.message);
            return { ...issue, ...encodedMessage };
        }
        catch (e) {
            throw new Error(`Failed to parse encoded issue message for rule ${issue.ruleId}:\n"${issue.message}". ${e.message}`);
        }
    }
    return issue;
}
exports.decodeSonarRuntime = decodeSonarRuntime;
//# sourceMappingURL=decode.js.map