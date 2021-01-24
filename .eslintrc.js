module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['@pxblue/eslint-config/tsx'],
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
