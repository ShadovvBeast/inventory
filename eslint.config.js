const arc = require('@architect/eslint-config')

module.exports = [
  ...arc,
  {
    ignores: [
      'scratch',
      'test/mock/',
    ],
  },
]
