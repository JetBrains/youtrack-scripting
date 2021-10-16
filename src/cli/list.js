const resolve = require('../../lib/net/resolve');
const exit = require('../../lib/cli/exit');
const request = require('../../lib/net/request');
const queryfields = require('../../lib/net/queryfields');
const HttpMessage = require('../../lib/net/httpmessage');

/**
 * @param {*} config 
 * @returns {*}
 */
module.exports = function(config) {
  var message = HttpMessage(resolve(config.host, '/api/admin/workflows'));
  message = config.token ? HttpMessage.sign(message, config.token) : message;
  message.query = message.query || {};
  message.query.fields = queryfields(['id', 'name']);
  message.query.$top = '-1';

  return request(message, (error, data) => {
    if (error) return exit(error);

    data.forEach((/**@type {*}*/x) => {
      print(x.name);
    });
  });

  function print(/**@type {string}*/name) {
    console.log(name);
  }
};
