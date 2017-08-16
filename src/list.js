const load = require('./load');

module.exports = function (config) {
  return load(config, data => {
    data.forEach((x) => {
      print(x.name);
    });
  });

  function print() {
    console.log.apply(console, arguments);
  }
};
