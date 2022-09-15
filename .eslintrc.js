module.exports = {
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true,
  },
  parser: 'vue-eslint-parser',
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: false,
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
    'vue/require-default-prop': 'off', // prop 默认值
    'vue/require-prop-types': 'off', // prop type
    'vue/html-quotes': ['warn', 'single'],
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attributes-order': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/html-self-closing': 'off',
    '@typescript-eslint/no-empty-function': 'off'
  },
};
