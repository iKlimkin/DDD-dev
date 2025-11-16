'use strict';

const init = require('eslint-config-metarhia');

module.exports = [...init, { rules: { 'no-console': 'off' } }];
