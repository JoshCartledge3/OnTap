const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');

module.exports = defineConfig([
    expo,
    { ignores: ['src/api/generated/**'] },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ['src/components/typography/AppText.tsx'],
        rules: {
            'no-restricted-syntax': ['error', {
                selector: "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name='Text']",
                message: 'Use AppText instead of React Native Text. Only AppText.tsx may import Text.',
            }, {
                selector: "ExportNamedDeclaration[source.value='react-native'] > ExportSpecifier[local.name='Text']",
                message: 'Do not re-export React Native Text. Use AppText instead.',
            }, {
                selector: "ImportDeclaration[source.value='react-native'] > :matches(ImportNamespaceSpecifier, ImportDefaultSpecifier)",
                message: 'Use named React Native imports so the AppText boundary cannot be bypassed.',
            }, {
                selector: "ExportAllDeclaration[source.value='react-native']",
                message: 'Do not re-export all of React Native. Export AppText for application text.',
            }],
        },
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ['src/hooks/**/use[A-Z]*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                paths: [{
                    name: 'react',
                    importNames: ['useContext'],
                    message: 'Consume context through the concern hook in src/hooks/.',
                }],
                patterns: [{
                    group: ['**/contexts/**', '**/context/**', '**/*Context', '**/*Context.*', '!react-native-safe-area-context'],
                    message: 'Context files may only be imported by concern hooks in src/hooks/.',
                }, {
                    group: ['**/services/**', '**/*Service', '**/*Service.*'],
                    message: 'Service files may only be imported by concern hooks in src/hooks/.',
                }],
            }],
        },
    },
    {
        files: ['src/providers/index.ts'],
        rules: {
            'no-restricted-imports': ['error', {
                paths: [{
                    name: 'react',
                    importNames: ['useContext'],
                    message: 'Consume context through the concern hook in src/hooks/.',
                }],
                patterns: [{
                    group: ['**/contexts/**', '**/context/**', '**/*Context', '**/*Context.*', '!react-native-safe-area-context'],
                    allowImportNamePattern: 'Provider$',
                    message: 'The provider entry point may only expose named providers, not raw contexts.',
                }, {
                    group: ['**/services/**', '**/*Service', '**/*Service.*'],
                    message: 'Service files may only be imported by concern hooks in src/hooks/.',
                }],
            }],
        },
    },
]);
