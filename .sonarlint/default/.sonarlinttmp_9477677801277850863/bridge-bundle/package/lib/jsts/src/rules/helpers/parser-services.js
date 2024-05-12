"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequiredParserServices = void 0;
function isRequiredParserServices(services) {
    // see https://github.com/typescript-eslint/typescript-eslint/issues/7124
    return !!services?.program;
}
exports.isRequiredParserServices = isRequiredParserServices;
//# sourceMappingURL=parser-services.js.map