const Url = require('url');
const resolve = require('./resolve');

/**
 * @typedef {import('url').UrlWithParsedQuery & {headers: Object<string,string>, method?: string}} Message
 * @param {string|Message} url 
 * @returns {Message}
 */
function HttpMessage(url) {
  if (typeof url === 'string') {
    url = resolve(url, '');
  }

  /**@type {Message}*/
  // @ts-ignore
  const message = Url.parse(url);

  if (!message.headers) message.headers = {};

  return message;
}

/**
 * @param {Message} message 
 * @param {string} token 
 * @returns {Message}
 */
HttpMessage.sign = (message, token) => {
  if (!token) throw Error('HttpMessage: token is required');

  const signedMessage = HttpMessage(message);
  signedMessage.headers['Authorization'] = 'Bearer ' + token;
  return signedMessage;
};

module.exports = HttpMessage;
