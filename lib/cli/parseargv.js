function parse(argv) {
  return require('minimist')(argv.slice(2));
}

module.exports = parse;