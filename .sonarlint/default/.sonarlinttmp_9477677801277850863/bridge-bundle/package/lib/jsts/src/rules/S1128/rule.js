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
// https://sonarsource.github.io/rspec/#/rspec/S1128/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("../helpers");
const EXCLUDED_IMPORTS = ['React'];
const JSDOC_TAGS = [
    '@abstract',
    '@access',
    '@alias',
    '@arg',
    '@argument',
    '@async',
    '@augments',
    '@author',
    '@borrows',
    '@callback',
    '@class',
    '@classdesc',
    '@const',
    '@constant',
    '@constructor',
    '@constructs',
    '@copyright',
    '@default',
    '@defaultvalue',
    '@deprecated',
    '@desc',
    '@description',
    '@emits',
    '@enum',
    '@event',
    '@example',
    '@exception',
    '@exports',
    '@extends',
    '@external',
    '@file',
    '@fileoverview',
    '@fires',
    '@func',
    '@function',
    '@generator',
    '@global',
    '@hideconstructor',
    '@host',
    '@ignore',
    '@implements',
    '@inheritdoc',
    '@inner',
    '@instance',
    '@interface',
    '@kind',
    '@lends',
    '@license',
    '@link',
    '@linkcode',
    '@linkplain',
    '@listens',
    '@member',
    '@memberof',
    '@method',
    '@mixes',
    '@mixin',
    '@module',
    '@name',
    '@namespace',
    '@override',
    '@overview',
    '@package',
    '@param',
    '@private',
    '@prop',
    '@property',
    '@protected',
    '@public',
    '@readonly',
    '@requires',
    '@return',
    '@returns',
    '@see',
    '@since',
    '@static',
    '@summary',
    '@this',
    '@throws',
    '@todo',
    '@tutorial',
    '@type',
    '@typedef',
    '@var',
    '@variation',
    '@version',
    '@virtual',
    '@yield',
    '@yields',
];
exports.rule = {
    meta: {
        messages: {
            removeUnusedImport: `Remove this unused import of '{{symbol}}'.`,
            suggestRemoveWholeStatement: `Remove this import statement`,
            suggestRemoveOneVariable: `Remove this variable import`,
        },
        hasSuggestions: true,
    },
    create(context) {
        const isJsxPragmaSet = context.sourceCode.getAllComments().findIndex(comment => comment.value.includes('@jsx jsx')) >
            -1;
        const unusedImports = [];
        const tsTypeIdentifiers = new Set();
        const vueIdentifiers = new Set();
        const saveTypeIdentifier = (node) => tsTypeIdentifiers.add(node.name);
        function isExcluded(variable) {
            return EXCLUDED_IMPORTS.includes(variable.name);
        }
        function isUnused(variable) {
            return variable.references.length === 0;
        }
        function isImplicitJsx(variable) {
            return variable.name === 'jsx' && isJsxPragmaSet;
        }
        const ruleListener = {
            ImportDeclaration: (node) => {
                const variables = context.getDeclaredVariables(node);
                for (const variable of variables) {
                    if (!isExcluded(variable) && !isImplicitJsx(variable) && isUnused(variable)) {
                        unusedImports.push({
                            id: variable.identifiers[0],
                            importDecl: node,
                        });
                    }
                }
            },
            'TSTypeReference > Identifier, TSClassImplements > Identifier, TSInterfaceHeritage > Identifier': (node) => {
                saveTypeIdentifier(node);
            },
            "TSQualifiedName[left.type = 'Identifier']": (node) => {
                saveTypeIdentifier(node.left);
            },
            "TSInterfaceHeritage > MemberExpression[object.type = 'Identifier'], TSClassImplements > MemberExpression[object.type = 'Identifier']": (node) => {
                saveTypeIdentifier(node.object);
            },
            'Program:exit': () => {
                const jsxFactories = getJsxFactories(context);
                const jsxIdentifiers = getJsxIdentifiers(context);
                const jsDocComments = getJsDocComments(context);
                unusedImports
                    .filter(({ id: unused }) => !jsxIdentifiers.includes(unused.name) &&
                    !tsTypeIdentifiers.has(unused.name) &&
                    !(vueIdentifiers.has(unused.name) && (0, helpers_1.isInsideVueSetupScript)(unused, context)) &&
                    !jsxFactories.has(unused.name) &&
                    !jsDocComments.some(comment => comment.value.includes(unused.name)))
                    .forEach(unused => context.report({
                    messageId: 'removeUnusedImport',
                    data: {
                        symbol: unused.id.name,
                    },
                    node: unused.id,
                    suggest: [getSuggestion(context, unused)],
                }));
            },
        };
        // @ts-ignore
        if (context.sourceCode.parserServices.defineTemplateBodyVisitor) {
            return context.sourceCode.parserServices.defineTemplateBodyVisitor({
                VElement: (node) => {
                    const { rawName } = node;
                    const name = rawName.split('.')[0];
                    vueIdentifiers.add(toCamelCase(name));
                    vueIdentifiers.add(toPascalCase(name));
                },
                VDirectiveKey: (node) => {
                    const { name: { name }, } = node;
                    vueIdentifiers.add(toCamelCase(name));
                    vueIdentifiers.add(toPascalCase(name));
                },
                Identifier: (node) => {
                    vueIdentifiers.add(node.name);
                },
            }, ruleListener, { templateBodyTriggerSelector: 'Program' });
        }
        return ruleListener;
    },
};
// vue only capitalizes the char after '-'
function toCamelCase(str) {
    return str.replace(/-\w/g, s => s[1].toUpperCase());
}
function toPascalCase(str) {
    const camelized = toCamelCase(str);
    return camelized[0].toUpperCase() + camelized.slice(1);
}
function getSuggestion(context, { id, importDecl }) {
    const variables = context.getDeclaredVariables(importDecl);
    if (variables.length === 1) {
        return {
            messageId: 'suggestRemoveWholeStatement',
            fix: fixer => {
                return (0, helpers_1.removeNodeWithLeadingWhitespaces)(context, importDecl, fixer);
            },
        };
    }
    const specifiers = importDecl.specifiers;
    const unusedSpecifier = specifiers.find(specifier => specifier.local === id);
    const code = context.sourceCode;
    let range;
    switch (unusedSpecifier.type) {
        case 'ImportDefaultSpecifier': {
            const tokenAfter = code.getTokenAfter(id);
            // default import is always first
            range = [id.range[0], code.getTokenAfter(tokenAfter).range[0]];
            break;
        }
        case 'ImportNamespaceSpecifier':
            // namespace import is always second
            range = [code.getTokenBefore(unusedSpecifier).range[0], unusedSpecifier.range[1]];
            break;
        case 'ImportSpecifier': {
            const simpleSpecifiers = specifiers.filter(specifier => specifier.type === 'ImportSpecifier');
            const index = simpleSpecifiers.findIndex(specifier => specifier === unusedSpecifier);
            if (simpleSpecifiers.length === 1) {
                range = [specifiers[0].range[1], code.getTokenAfter(unusedSpecifier).range[1]];
            }
            else if (index === 0) {
                range = [simpleSpecifiers[0].range[0], simpleSpecifiers[1].range[0]];
            }
            else {
                range = [simpleSpecifiers[index - 1].range[1], simpleSpecifiers[index].range[1]];
            }
        }
    }
    return {
        messageId: 'suggestRemoveOneVariable',
        fix: fixer => {
            return fixer.removeRange(range);
        },
    };
}
function getJsxFactories(context) {
    const factories = new Set();
    const parserServices = context.sourceCode.parserServices;
    if ((0, helpers_1.isRequiredParserServices)(parserServices)) {
        const compilerOptions = parserServices.program.getCompilerOptions();
        if (compilerOptions.jsxFactory) {
            factories.add(compilerOptions.jsxFactory);
        }
        if (compilerOptions.jsxFragmentFactory) {
            factories.add(compilerOptions.jsxFragmentFactory);
        }
    }
    return factories;
}
function getJsxIdentifiers(context) {
    return context.sourceCode.ast.tokens
        .filter(token => token.type === 'JSXIdentifier')
        .map(token => token.value);
}
function getJsDocComments(context) {
    return context.sourceCode
        .getAllComments()
        .filter(comment => comment.type === 'Block' && JSDOC_TAGS.some(tag => comment.value.includes(tag)));
}
//# sourceMappingURL=rule.js.map