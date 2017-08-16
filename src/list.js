var resolve = require('url').resolve;
var net = require('../lib/net/index');

var request = net.request;
var sign = net.sign;
var addFields = net.addFields;


module.exports = function(config) {
  var url = resolve(config.host, '/api/admin/workflows');

  return request(sign(addFields(url, ['id', 'name']), config.token), (error, data) => {
    if (!error) {
      data.forEach((x) => {
        print(x.name);
      })
    } else {
      throw error;
    }
  });

  function print() {
    console.log.apply(console, arguments);
  }
};
