/* eslint configuration for orchestration-cluster-api-js */
module.exports = {
  root: true,
  env: { es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: undefined, ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  settings: {},
  rules: {
    'prefer-const': ['error', { destructuring: 'all' }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
    ],
    'import/order': [
      'warn',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc', caseInsensitive: true }
      }
    ],
  // Turn off for generated relative paths; TypeScript compiler will catch real issues.
  'import/no-unresolved': 'off',
    'import/newline-after-import': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off'
  },
  overrides: [
    {
      files: ['scripts/**/*.ts'],
      rules: { '@typescript-eslint/no-var-requires': 'off' }
    },
    {
      files: ['tests**/*.ts'],
      env: { jest: true },
      rules: { '@typescript-eslint/no-explicit-any': 'off' }
    }
  ]
};
