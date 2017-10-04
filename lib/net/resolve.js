module.exports = (url, a) => {
  if (typeof url === 'string' &&
    !(/^http(s)?:\/\//.test(url))) {
    url = 'http://' + url;
  }

  if (a && !/\/$/.test(url)) {
    url += '/';
  }

  if (a) {
    a = a.replace(/^\//, '');
  }

  const resolve = require('url').resolve;
  return resolve(url, a);
};
