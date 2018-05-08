const assert = require('assert');
const colors = require('colors/safe');

exports.suite = function testSuite(name, cb) {
  console.log(`\n\n${colors.gray('-'.repeat(50))}\n`);
  console.log(`   ${colors.gray('Testing')} ${name}\n`);

  const time = process.hrtime();
  cb();
  const diff = process.hrtime(time);
  console.log('\n' + colors.gray(`Took ${diff[1] / 1e9} seconds`)); // eslint-disable-line
};

exports.test = function testCase(title, cb) {
  try {
    cb(assert);
    console.log(`   ${colors.green('✔')}︎ ${title}`);
  } catch (ex) {
    console.error('\n' + colors.red('Oh no, we failed some:\n')); // eslint-disable-line
    console.error(`   ${colors.red('✗')} ${colors.red(title)}\n`);
    throw ex;
  }
};
