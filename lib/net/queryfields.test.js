const queryfields = require('./queryfields');

describe('queryfields.test', function() {
  it('should create fields query string', function() {
    expect(queryfields(['foo'])).toEqual('foo');
    expect(queryfields(['foo', 'bar'])).toEqual('foo,bar');
    expect(queryfields([{foo: ['bar']}])).toEqual('foo(bar)');
    expect(queryfields([{foo: ['bar']}, 'bar'])).toEqual('foo(bar),bar');
    expect(queryfields([{foo: ['bar', {foo: ['bar']}]}, 'bar'])).toEqual('foo(bar,foo(bar)),bar');
  });
});
