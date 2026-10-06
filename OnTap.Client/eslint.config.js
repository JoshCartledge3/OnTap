const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');

module.exports = defineConfig([
    expo,
    { ignores: ['src/api/generated/**'] },
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
                    group: ['**/contexts/**', '**/context/**', '**/*Context', '**/*Context.*'],
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
                    group: ['**/contexts/**', '**/context/**', '**/*Context', '**/*Context.*'],
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
