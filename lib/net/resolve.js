/**
 * @param {string} url
 * @param {string} a
 * @returns {string}
 */
module.exports = (url, a) => {
  if (typeof url === 'string' &&
    !(/^http(s)?:\/\//.test(url))) {
    url = `https://${url}`;
  }

  if (a && !/\/$/.test(url)) {
    url += '/';
  }

  if (a) {
    a = a.replace(/^\//, '');
  }

  return new URL(a, url).href;
};
