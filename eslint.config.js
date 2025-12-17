// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const reactNative = require('eslint-plugin-react-native');

module.exports = defineConfig([
    expoConfig,
    eslintPluginPrettierRecommended,

    {
        ignores: ['dist/*'],
    },
    {
        plugins: {
            'react-native': reactNative,
        },
        rules: {
            quotes: ['error', 'single', { allowTemplateLiterals: true }],
            'no-console': 'warn', // Warn on console logs (common in React Native debugging)
            'react-native/no-unused-styles': 'error', // React Native specific rule
            'react-native/no-inline-styles': 'off', // Warn against inline styles
            'react-native/no-color-literals': 'off', // Warn against hardcoded colors
        },
    },
]);
