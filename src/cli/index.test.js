var nock = require('nock');
nock.back.setMode('record');

describe('index', function() {
  beforeEach(function() {
    nock.disableNetConnect();
    spyOn(console, 'log');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should print version', function() {
    require('./index').run(['', '', 'version']);
    expect(console.log).toHaveBeenCalledWith(require('../../package.json').version);
  });

  it('should show error message if required parameter doesn`t have value', function() {
    spyOn(console, 'error');
    spyOn(process, 'exit');
    require('./index').run(['', '', 'list', '--host=']);
    expect(console.error).toHaveBeenCalledWith('Error: Option "--host" is required');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should not throw error if user passed all required parameters', function() {
    spyOn(console, 'error').and.callThrough();
    spyOn(process, 'exit');

    nock('http://foo:80')
      .get((uri) => uri.includes('/api/admin/workflows'))
      .reply(200, []);

    require('./index').run(['', '', 'list', '--host=foo']);

    expect(console.error).not.toHaveBeenCalled();
    expect(process.exit).not.toHaveBeenCalled();
  });
});
