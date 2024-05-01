module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint', '@reverecre/fontawesome'],
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    '@reverecre/fontawesome/shakeable-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['interface', 'typeAlias', 'enum'],
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    // TODO(REV-3849): Enable these rules for type imports.
    // '@typescript-eslint/no-import-type-side-effects': 'error',
    // '@typescript-eslint/consistent-type-imports': [
    //   'error',
    //   { fixStyle: 'inline-type-imports' },
    // ],
    'default-case': ['error'],
    'guard-for-in': 'error',
    'no-return-await': 'off',
    curly: ['error', 'multi-line'],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-console': 'error',
    'no-sequences': 'error',
    radix: ['error', 'always'],
    // TODO(ryan): Enable this rule.
    // '@typescript-eslint/strict-boolean-expressions': 'error',
  },
};
