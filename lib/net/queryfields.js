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
      Object.keys(it).reduce((result, i) => {
        return result.concat(
          i + '(' + queryfields(it[i]) + ')'
        );
      }, [])
    );
  }
}

module.exports = queryfields;
