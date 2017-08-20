module.exports = (url, a) => {
  if (typeof url === 'string' &&
    !(/^http(s)?:\/\//.test(url))) {
    url = 'http://' + url;
  }

  const resolve = require('url').resolve;
  return resolve(url, a);
};
