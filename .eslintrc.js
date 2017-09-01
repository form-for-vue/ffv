module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended', // or 'plugin:vue/base'
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  // add your custom rules here
  'rules': {
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'arrow-parens': ['error', 'as-needed'],
    'import/first': 2,
    'import/no-unresolved': 0,
    'sort-imports': 2,
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'comma-dangle': ['error', 'only-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? ['error', {'allow': ['warn', 'error']}] : 0,
    'indent': ['error', 2],
    'semi': ['error', 'never'],
    'consistent-return': 0,
    'curly': ['error', 'multi'],
    'space-before-function-paren': ['error', 'always'],
    'space-before-blocks': 2,
    'vue/order-in-components': ['error', {
      'order': [
        ['name', 'delimiters', 'functional', 'model'],
        ['components', 'directives', 'filters'],
        ['parent', 'mixins', 'extends', 'provide', 'inject'],
        'el',
        'template',
        'props',
        'propsData',
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        'render',
        'renderError'
      ]
    }]
  },
  globals: {
    requestAnimationFrame: true,
    performance: true
  },
}
