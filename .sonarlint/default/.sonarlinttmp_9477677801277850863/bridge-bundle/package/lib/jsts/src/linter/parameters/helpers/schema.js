"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuleSchema = void 0;
const shared_1 = require("@sonar/shared");
/**
 * Extracts the schema of a rule
 * @param ruleModule the rule definition
 * @param ruleId the rule id
 * @returns the extracted rule schema, if any
 */
function getRuleSchema(ruleModule, ruleId) {
    if (!ruleModule) {
        (0, shared_1.debug)(`ruleModule not found for rule ${ruleId}`);
        return undefined;
    }
    if (!ruleModule.meta?.schema) {
        return undefined;
    }
    const { schema } = ruleModule.meta;
    return Array.isArray(schema) ? schema : [schema];
}
exports.getRuleSchema = getRuleSchema;
//# sourceMappingURL=schema.js.map