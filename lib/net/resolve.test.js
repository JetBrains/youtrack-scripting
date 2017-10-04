var expect = require('expect');
var resolve = require('./resolve');


describe('resolve', function() {
  it('should add default protocol', function() {
    expect(resolve('foo/', 'bar')).toEqual('http://foo/bar');
  });


  it('should correct resolve url for YouTrack with context', function() {
    expect(resolve('http://foo/bar', '/zoo')).toEqual('http://foo/bar/zoo');
  });
});
