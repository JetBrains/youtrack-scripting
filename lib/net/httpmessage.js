var Url = require('url');
var resolve = require('./resolve');

function HttpMessage(url) {
  if (typeof url === 'string') {
    url = resolve(url, '');
  }

  var message = Url.parse(url);

  if (!message.headers) message.headers = {};

  return message;
}

HttpMessage.sign = (message, token) => {
  if (!token) throw Error('HttpMessage: token is required');

  var signedMessage = new HttpMessage(message);
  signedMessage.headers['Authorization'] = 'Bearer ' + token;
  return signedMessage;
};

module.exports = HttpMessage;
