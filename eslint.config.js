'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  { rules: { 'max-len': 'off', 'consistent-return': 'off' } },
  {
    files: ['api/**/*.js'],
    languageOptions: {
      globals: {
        db: 'readonly',
        common: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
    rules: {
      strict: ['error', 'never'],
      'class-methods-use-this': 'off',
    },
  },
];
