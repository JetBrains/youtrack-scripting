const minimist = require('minimist');

/**
 * @param {string[]} argv
 * @returns {minimist.ParsedArgs}
 */
function parse(argv) {
  return minimist(argv.slice(2));
}

module.exports = parse;
