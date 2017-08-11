var net = require('../lib/net');

var request = net.request;
var sign = net.sign;
var addFields = net.addFields;


module.exports.query = function(config, fn) {
  return request(sign(addFields(config.host, ['id', 'name']), config.token), (error, data) => {
    fn && fn(error, data);
  });
};