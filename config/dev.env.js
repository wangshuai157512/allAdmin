'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  // BASE_API_DEBUG: '"https://xxzx.chinaedu.net"',
  // BASE_API_DEBUG: '"https://uec.chinaedu.net"',
  BASE_API_DEBUG: '"http://localhost:3002"'
  // BASE_API_DEBUG: '"http://172.16.17.234:3002"'
})
