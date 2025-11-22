module.exports = {
    root: true,
    extends: '@react-native',
    rules: {
        // 'react-hooks/exhaustive-deps': 'off', // Disable exhaustive-deps for React Native
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        'no-console': 'warn', // Warn on console logs (common in React Native debugging)
        'react/no-unstable-nested-components': 'off',
        'react-native/no-unused-styles': 'error', // React Native specific rule
        'react-native/split-platform-components': 'warn', // Warn if platform-specific files aren't split
        'react-native/no-inline-styles': 'off', // Warn against inline styles
        'react-native/no-color-literals': 'off', // Warn against hardcoded colors
    },
};
