const parse = require('./parseargv');

describe('parseargv', function() {
  it('should parse passed arguments', function() {
    const baseargs = ['node', 'cli'];
    expect(parse(baseargs.concat(['--host', 'foo'])).host).toEqual('foo');
    expect(parse(baseargs.concat(['--host=foo'])).host).toEqual('foo');
  });
});