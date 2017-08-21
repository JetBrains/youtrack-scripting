const resolve = require('../../lib/net/resolve');
const exit = require('../../lib/cli/exit');
const request = require('../../lib/net/request');
const queryfields = require('../../lib/net/queryfields');
const HttpMessage = require('../../lib/net/httpmessage');

module.exports = function(config) {
  var message = new HttpMessage(resolve(config.host, '/api/admin/workflows'));
  message = config.token ? HttpMessage.sign(message, config.token) : message;
  message.query = message.query || {};
  message.query.fields = queryfields(['id', 'name']);

  return request(message, (error, data) => {
    if (error) return exit(error);

    data.forEach((x) => {
      print(x.name);
    });
  });

  function print() {
    console.log.apply(console, arguments);
  }
};
