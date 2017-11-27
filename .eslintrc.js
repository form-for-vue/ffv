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
    'brace-style': 2,
    'comma-dangle': ['error', 'only-multiline'],
    'no-console': process.env.NODE_ENV === 'production' ? ['error', {'allow': ['warn', 'error']}] : 0,
    'indent': ['error', 2, { "SwitchCase": 1 }],
    'semi': ['error', 'never'],
    'consistent-return': 0,
    'curly': ['error', 'all'],
    'space-before-function-paren': ['error', 'always'],
    'space-before-blocks': 2,
    'no-multi-spaces': 2,
    "object-curly-spacing": [2, "always"],
    "keyword-spacing": ["error"],
    // vue eslint
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
    }],
    'vue/mustache-interpolation-spacing': [2, 'always'],
    'vue/v-bind-style': 2,
    'vue/v-on-style': 2,
    'vue/no-multi-spaces': 2,
    'vue/max-attributes-per-line': 2,
    'vue/attribute-hyphenation': [2, 'never'],
  },
  globals: {
    requestAnimationFrame: true,
    performance: true
  },
}
