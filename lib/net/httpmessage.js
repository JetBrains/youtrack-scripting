const resolve = require('./resolve');

/**
 * @param {URL|string} url
 * @returns {URL}
 */
function HttpMessage(url) {
  if (typeof url === 'string') {
    url = resolve(url, '');
  }
  return new URL(url);
}

/**
 * @param {string} token
 * @returns {{headers: {Authorization: string}}}
 */
HttpMessage.sign = (token) => {
  if (!token) throw Error('HttpMessage: token is required');

  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

module.exports = HttpMessage;
