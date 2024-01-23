module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['@brightlayer-ui/eslint-config/tsx'],
    rules: {
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
    },
    parserOptions: {
        project: './tsconfig.json',
    },
    env: {
        browser: true,
    },
};
