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
/**
 * This file provides an API to take control over TypeScript's Program instances
 * in the context of program-based analysis for JavaScript / TypeScript.
 *
 * A TypeScript's Program instance is used by TypeScript ESLint parser in order
 * to make available TypeScript's type checker for rules willing to use type
 * information for the sake of precision. It works similarly as using TSConfigs
 * except it gives the control over the lifecycle of this internal data structure
 * used by the parser and improves performance.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTSConfigFile = exports.writeTSConfigFile = exports.isRoot = exports.isRootNodeModules = exports.deleteProgram = exports.getProgramById = exports.createAndSaveProgram = exports.createProgram = exports.createProgramOptions = void 0;
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const shared_1 = require("@sonar/shared");
const tmp_1 = __importDefault(require("tmp"));
const util_1 = require("util");
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Gets the files resolved by a TSConfig
 *
 * The resolving of the files for a given TSConfig file is done
 * by invoking TypeScript compiler.
 *
 * @param tsConfig TSConfig to parse
 * @param tsconfigContents TSConfig contents that we want to provide to TSConfig
 * @returns the resolved TSConfig files
 */
function createProgramOptions(tsConfig, tsconfigContents) {
    let missingTsConfig = false;
    const parseConfigHost = {
        useCaseSensitiveFileNames: true,
        readDirectory: typescript_1.default.sys.readDirectory,
        fileExists: file => {
            // When Typescript checks for the very last tsconfig.json, we will always return true,
            // If the file does not exist in FS, we will return an empty configuration
            if (isLastTsConfigCheck(file)) {
                return true;
            }
            return typescript_1.default.sys.fileExists(file);
        },
        readFile: file => {
            if (file === tsConfig && tsconfigContents) {
                return tsconfigContents;
            }
            const fileContents = typescript_1.default.sys.readFile(file);
            // When Typescript search for tsconfig which does not exist, return empty configuration
            // only when the check is for the last location at the root node_modules
            if (!fileContents && isLastTsConfigCheck(file)) {
                missingTsConfig = true;
                console.log(`WARN Could not find tsconfig.json: ${file}; falling back to an empty configuration.`);
                return '{}';
            }
            return fileContents;
        },
    };
    const config = typescript_1.default.readConfigFile(tsConfig, parseConfigHost.readFile);
    if (config.error) {
        (0, shared_1.error)(`Failed to parse tsconfig: ${tsConfig} (${diagnosticToString(config.error)})`);
        throw Error(diagnosticToString(config.error));
    }
    const parsedConfigFile = typescript_1.default.parseJsonConfigFileContent(config.config, parseConfigHost, path_1.default.resolve(path_1.default.dirname(tsConfig)), {
        noEmit: true,
    }, tsConfig, undefined, [
        {
            extension: 'vue',
            isMixedContent: true,
            scriptKind: typescript_1.default.ScriptKind.Deferred,
        },
    ]);
    if (parsedConfigFile.errors.length > 0) {
        const message = parsedConfigFile.errors.map(diagnosticToString).join('; ');
        throw Error(message);
    }
    return {
        rootNames: parsedConfigFile.fileNames,
        options: { ...parsedConfigFile.options, allowNonTsExtensions: true },
        projectReferences: parsedConfigFile.projectReferences,
        missingTsConfig,
    };
}
exports.createProgramOptions = createProgramOptions;
/**
 * Creates a TypeScript's Program instance
 *
 * TypeScript creates a Program instance per TSConfig file. This means that one
 * needs a TSConfig to create such a program. Therefore, the function expects a
 * TSConfig as an input, parses it and uses it to create a TypeScript's Program
 * instance. The program creation delegates to TypeScript the resolving of input
 * files considered by the TSConfig as well as any project references.
 *
 * @param tsConfig the TSConfig input to create a program for
 * @param tsconfigContents TSConfig contents that we want to provide to TSConfig
 * @returns the identifier of the created TypeScript's Program along with the
 *          program itself, the resolved files, project references and a boolean
 *          'missingTsConfig' which is true when an extended tsconfig.json path
 *          was not found, which defaulted to default Typescript configuration
 */
function createProgram(tsConfig, tsconfigContents) {
    if (!tsconfigContents) {
        tsconfigContents = (0, shared_1.readFileSync)(tsConfig);
    }
    const programOptions = createProgramOptions(tsConfig, tsconfigContents);
    const program = typescript_1.default.createProgram(programOptions);
    const inputProjectReferences = program.getProjectReferences() ?? [];
    const projectReferences = [];
    for (const reference of inputProjectReferences) {
        const sanitizedReference = (0, shared_1.addTsConfigIfDirectory)(reference.path);
        if (!sanitizedReference) {
            (0, shared_1.warn)(`Skipping missing referenced tsconfig.json: ${reference.path}`);
        }
        else {
            projectReferences.push(sanitizedReference);
        }
    }
    const files = program
        .getSourceFiles()
        .map(sourceFile => sourceFile.fileName)
        .filter(exceptions);
    return {
        files,
        projectReferences,
        missingTsConfig: programOptions.missingTsConfig,
        program,
    };
    function exceptions(filename) {
        const { dir, ext } = path_1.default.parse(filename);
        /* JSON files */
        if (ext === '.json') {
            return false;
        }
        /* Node modules */
        if ((0, shared_1.toUnixPath)(dir).split('/').includes('node_modules')) {
            return false;
        }
        return true;
    }
}
exports.createProgram = createProgram;
/**
 * A cache of created TypeScript's Program instances
 *
 * It associates a program identifier to an instance of a TypeScript's Program.
 */
const programs = new Map();
/**
 * A counter of created TypeScript's Program instances
 */
let programCount = 0;
/**
 * Computes the next identifier available for a TypeScript's Program.
 * @returns
 */
function nextId() {
    programCount++;
    return programCount.toString();
}
/**
 * Creates a TypeScript's Program instance and saves it in memory
 *
 * To be removed once Java part does not handle program creation
 */
function createAndSaveProgram(tsConfig) {
    const program = createProgram(tsConfig);
    const programId = nextId();
    programs.set(programId, program.program);
    (0, shared_1.debug)(`program from ${tsConfig} with id ${programId} is created`);
    return { ...program, programId };
}
exports.createAndSaveProgram = createAndSaveProgram;
/**
 * Gets an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to retrieve
 * @throws a runtime error if there is no such program
 * @returns the retrieved TypeScript's Program
 */
function getProgramById(programId) {
    const program = programs.get(programId);
    if (!program) {
        throw Error(`Failed to find program ${programId}`);
    }
    return program;
}
exports.getProgramById = getProgramById;
/**
 * Deletes an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to delete
 */
function deleteProgram(programId) {
    programs.delete(programId);
}
exports.deleteProgram = deleteProgram;
function diagnosticToString(diagnostic) {
    const text = typeof diagnostic.messageText === 'string'
        ? diagnostic.messageText
        : diagnostic.messageText.messageText;
    if (diagnostic.file) {
        return `${text}  ${diagnostic.file?.fileName}:${diagnostic.start}`;
    }
    else {
        return text;
    }
}
/**
 * Typescript resolution will always start searching by first looking for package.json files
 * starting in $TSCONFIG_PATH/package.json and on each parent until root folder.
 * 1 - $TSCONFIG_PATH/package.json
 * 2 - $TSCONFIG_PATH/../package.json
 * 3 - $TSCONFIG_PATH/../../package.json
 * ...
 * N - /package.json
 *
 * Then, Typescript resolution will always search for extended tsconfigs in these 5 paths (in order):
 *
 * 1 - $TSCONFIG_PATH/node_modules/$EXTENDED_TSCONFIG_VALUE/package.json
 * 2 - $TSCONFIG_PATH/node_modules/$EXTENDED_TSCONFIG_VALUE/../package.json
 * 3 - $TSCONFIG_PATH/node_modules/$EXTENDED_TSCONFIG_VALUE
 * 4 - $TSCONFIG_PATH/node_modules/$EXTENDED_TSCONFIG_VALUE.json
 * 5 - $TSCONFIG_PATH/node_modules/$EXTENDED_TSCONFIG_VALUE/tsconfig.json
 *
 * If not found in all 4, $TSCONFIG_PATH will be assigned to its parent and the same search will be performed,
 * until $TSCONFIG_PATH is the system root. Meaning, the very last search Typescript will perform is (5) when
 * TSCONFIG_PATH === '/':
 *
 * /node_modules/$EXTENDED_TSCONFIG_VALUE/tsconfig.json
 *
 * @param file
 */
function isLastTsConfigCheck(file) {
    return path_1.default.basename(file) === 'tsconfig.json' && isRootNodeModules(file);
}
function isRootNodeModules(file) {
    const root = process.platform === 'win32' ? file.slice(0, file.indexOf(':') + 1) : '/';
    const normalizedFile = (0, shared_1.toUnixPath)(file);
    const topNodeModules = (0, shared_1.toUnixPath)(path_1.default.resolve(path_1.default.join(root, 'node_modules')));
    return normalizedFile.startsWith(topNodeModules);
}
exports.isRootNodeModules = isRootNodeModules;
function isRoot(file) {
    return (0, shared_1.toUnixPath)(file) === (0, shared_1.toUnixPath)(path_1.default.parse(file).root);
}
exports.isRoot = isRoot;
/**
 * Any temporary file created with the `tmp` library will be removed once the Node.js process terminates.
 */
tmp_1.default.setGracefulCleanup();
/**
 * Create the TSConfig file and returns its path.
 *
 * The file is written in a temporary location in the file system
 * and is marked to be removed after Node.js process terminates.
 *
 * @param tsConfig TSConfig to write
 * @returns the resolved TSConfig file path
 */
async function writeTSConfigFile(tsConfig) {
    const filename = await (0, util_1.promisify)(tmp_1.default.file)();
    await promises_1.default.writeFile(filename, JSON.stringify(tsConfig), 'utf-8');
    return { filename };
}
exports.writeTSConfigFile = writeTSConfigFile;
/**
 * Create and return a TSConfig object.
 *
 * @param files array of files included in the TS program
 * @param include inclusion paths of the TS Program
 * @returns the TSConfig object
 */
function createTSConfigFile(files, include) {
    return {
        compilerOptions: {
            allowJs: true,
            noImplicitAny: true,
        },
        include,
        files,
    };
}
exports.createTSConfigFile = createTSConfigFile;
//# sourceMappingURL=program.js.map