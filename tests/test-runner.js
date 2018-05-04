const assert = require('assert');

exports.test = function test(title, cb) {
  try {
    cb(assert);
    console.log(`\t✔︎ ${title}`);
  } catch (ex) {
    console.error(`\t✗ ${title}`);
    throw ex;
  }
};
