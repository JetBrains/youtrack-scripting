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
  let message = HttpMessage(resolve(config.host, '/api/admin/workflows'));
  const options = config.token ? HttpMessage.sign(config.token) : {};
  message.searchParams.append('fields',queryfields(['id', 'name']));
  message.searchParams.append('$top','-1');

  return request(message, options, (error, data) => {
    if (error) return exit(error);

    data.forEach((/**@type {*}*/x) => {
      print(x.name);
    });
  });

  function print(/**@type {string}*/name) {
    console.log(name);
  }
};
