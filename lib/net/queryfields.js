/**
 * @param {*} it 
 * @returns {string}
 */
function queryfields(it) {
  const u = require('util');

  if (u.isUndefined(it)) {
    return '';
  }

  if (u.isString(it)) {
    return it;
  }

  if (u.isArray(it)) {
    return it.map((i) => queryfields(i)).join(',');
  }

  if (u.isObject(it)) {
    return queryfields(
      Object.keys(it).reduce((/**@type {string[]}*/result, /**@type {string}*/i) => {
        return result.concat(
          i + '(' + queryfields(it[i]) + ')'
        );
      }, [])
    );
  }

  return '';
}

module.exports = queryfields;
