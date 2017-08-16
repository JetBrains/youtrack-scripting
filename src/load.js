const resolve = require('url').resolve;
const net = require('../lib/net/index');

const request = net.request;
const sign = net.sign;
const addFields = net.addFields;


module.exports = function (config, onLoadFn) {
  const url = resolve(config.host, '/api/admin/workflows');
  return request(sign(addFields(url, ['id', 'name']), config.token), (error, data) => {
    if (error) {
      throw error;
    }
    onLoadFn(data);
  });
};
