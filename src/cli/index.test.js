describe('index', function() {
  it('should print version', function() {
    spyOn(console, 'log');
    require('./index').run(['', '', 'version']);
    expect(console.log).toHaveBeenCalledWith(require('../../package.json').version);
  });
});