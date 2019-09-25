// export modified jest config
module.exports = Object.assign({}, require('./jest.js'), {
  // only text coverage
  coverageReporters = ['text-summary', 'text'],
});
